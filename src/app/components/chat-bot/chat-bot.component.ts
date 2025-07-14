import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { BrandService } from '../../services/brand.service';
import { Router } from '@angular/router';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
})
export class ChatBotComponent {
  isOpen = false;
  loading = false;
  question = '';
  chatHistory: { from: 'user' | 'bot'; message: string; isHtml?: boolean }[] = [];
  products: Product[] = [];
  lastDiscussedProduct: Product | null = null;
  brands: Brand[] = [];

  HF_TOKEN = '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';
  PROVIDER = 'together';
  MODEL_ID = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
  API_URL = `https://router.huggingface.co/${this.PROVIDER}/v1/chat/completions`;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private brandService: BrandService,
    private router: Router
  ) {
    this.loadProductsFromDatabase();
    this.loadBrands();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.question = '';
    this.lastDiscussedProduct = null;
  }

  loadProductsFromDatabase() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        
      },
      error: (err) => {
        console.error('Failed to load products for chatbot context:', err);
      }
    });
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Failed to load brands for chatbot context:', err);
      }
    });
  }

  async handleAsk() {
    const trimmed = this.question.trim();
    if (!trimmed) return;

    this.chatHistory.push({ from: 'user', message: trimmed });
    this.loading = true;

    const lowerQuestion = trimmed.toLowerCase();
    
    function isArabic(text: string): boolean {
      return /[\u0600-\u06FF]/.test(text);
    }
    const isArabicQuestion = isArabic(trimmed);

    const greetings = ['hi', 'hello', 'مرحبا', 'السلام عليكم', 'اهلا', 'hey'];
    if (greetings.some(greet => lowerQuestion.includes(greet))) {
      this.chatHistory.push({ from: 'bot', message: isArabicQuestion ? 'مرحباً! أنا بوت Ora Collective لمساعدتك في معرفة المنتجات المتوفرة في متجر الساعات. اسألني عن أي منتج أو اسأل عن الألوان المتاحة لأي ساعة.' : 'Hello! I am Ora Collective bot. I can help you find available products and their colors in the watch store. Ask me about any product or its available colors.' });
      this.question = '';
      this.loading = false;
      return;
    }

    const brandListKeywords = ['براند', 'براندات', 'ماركات', 'ماركة', 'brand', 'brands', 'البراندات', 'البراند'];
    const isBrandListQuestion = brandListKeywords.some(word => lowerQuestion.includes(word));
    
    if (isBrandListQuestion) {
      const uniqueBrands = [...new Set(this.products.map(product => product.productBrand?.name).filter(Boolean))];
      if (uniqueBrands.length > 0) {
        const brandList = uniqueBrands.map(brand => `- ${brand}`).join('\n');
        const reply = isArabicQuestion ? 
          `البراندات المتوفرة في متجرنا:\n${brandList}` : 
          `Available brands in our store:\n${brandList}`;
        this.chatHistory.push({ from: 'bot', message: reply });
        this.question = '';
        this.loading = false;
        return;
      } else {
        const reply = isArabicQuestion ? 'لا توجد براندات متوفرة حالياً.' : 'No brands available at the moment.';
        this.chatHistory.push({ from: 'bot', message: reply });
        this.question = '';
        this.loading = false;
        return;
      }
    }

    const brandProductsKeywords = ['منتجات', 'ساعات', 'products', 'watches', 'جيب', 'اعرض', 'show', 'get'];
    const isBrandProductsQuestion = brandProductsKeywords.some(word => lowerQuestion.includes(word));
    
    if (isBrandProductsQuestion) {
      // ابحث عن اسم البراند في السؤال
      const foundBrand = this.brands.find(brand => lowerQuestion.includes(brand.name.toLowerCase()));
      if (foundBrand && foundBrand.id !== undefined) {
        this.productService.getProductsByBrand(foundBrand.id).subscribe({
          next: (brandProducts) => {
            if (brandProducts.length > 0) {
              const topProducts = brandProducts.slice(0, 3);
              // بناء HTML للبطاقات Grid
              let html = `<div class='chatbot-product-grid'>`;
              topProducts.forEach(product => {
                const img = product.images && product.images.length > 0 ? (product.images[0].url.startsWith('http') ? product.images[0].url : 'https://localhost:7071' + product.images[0].url) : '';
                html += `
                  <a class='chatbot-product-card' href='/product/${product.id}' style='text-decoration:none;color:inherit;' onclick='event.preventDefault(); window.location.href="/product/${product.id}";'>
                    <img src='${img}' alt='${product.name}' class='chatbot-product-img'>
                    <div class='chatbot-product-name'>${product.name}</div>
                    <div class='chatbot-product-price'>${product.price} ج.م</div>
                  </a>`;
              });
              html += `</div>`;
              const reply = isArabicQuestion ? `أشهر منتجات براند ${foundBrand.name}:` : `Top products from ${foundBrand.name} brand:`;
              this.chatHistory.push({ from: 'bot', message: reply, isHtml: false });
              this.chatHistory.push({ from: 'bot', message: html, isHtml: true });
              setTimeout(() => {
                document.querySelectorAll('.chatbot-product-card').forEach(card => {
                  card.addEventListener('click', (e: any) => {
                    const id = card.getAttribute('data-product-id');
                    if (id) this.navigateToProduct(+id);
                  });
                });
              }, 100);
            } else {
              const reply = isArabicQuestion ? `لا توجد منتجات متاحة لهذا البراند حالياً.` : `No products available for this brand.`;
              this.chatHistory.push({ from: 'bot', message: reply });
            }
            this.question = '';
            this.loading = false;
          },
          error: (err) => {
            this.chatHistory.push({ from: 'bot', message: isArabicQuestion ? 'حدث خطأ أثناء جلب المنتجات.' : 'Error fetching products.' });
            this.question = '';
            this.loading = false;
          }
        });
        return;
      }
    }

    if (this.lastDiscussedProduct) {
      const colorKeywords = ['لون', 'ألوان', 'color', 'colors', 'ألوانه', 'ألوانها', 'لونه', 'لونها','الوان'];
      const isColorQuestion = colorKeywords.some(word => lowerQuestion.includes(word));
      
      if (isColorQuestion) {
        let reply = '';
        if (this.lastDiscussedProduct.colors && this.lastDiscussedProduct.colors.length > 0) {
          reply = isArabicQuestion ? 
            `الألوان المتاحة لمنتج ${this.lastDiscussedProduct.name}: ${this.lastDiscussedProduct.colors.join(', ')}` : 
            `Available colors for ${this.lastDiscussedProduct.name}: ${this.lastDiscussedProduct.colors.join(', ')}`;
        } else {
          reply = isArabicQuestion ? 
            `لا توجد ألوان محددة لهذا المنتج (${this.lastDiscussedProduct.name})` : 
            `No specific colors for this product (${this.lastDiscussedProduct.name})`;
        }
        this.chatHistory.push({ from: 'bot', message: reply });
        this.question = '';
        this.loading = false;
        return;
      }

      const priceKeywords = ['سعر', 'سعره', 'سعرها', 'price', 'cost', 'التكلفة', 'كم', 'how much'];
      const isPriceQuestion = priceKeywords.some(word => lowerQuestion.includes(word));
      
      if (isPriceQuestion) {
        const reply = isArabicQuestion ? 
          `سعر ${this.lastDiscussedProduct.name}: $${this.lastDiscussedProduct.price}` : 
          `Price of ${this.lastDiscussedProduct.name}: $${this.lastDiscussedProduct.price}`;
        this.chatHistory.push({ from: 'bot', message: reply });
        this.question = '';
        this.loading = false;
        return;
      }
    }

    let foundProduct = this.products.find(product => {
      const productName = product.name.toLowerCase();
      const brandName = product.productBrand?.name?.toLowerCase() || '';
      return (
        productName.includes(lowerQuestion) ||
        lowerQuestion.includes(productName) ||
        brandName.includes(lowerQuestion) ||
        lowerQuestion.includes(brandName)
      );
    });

    const colorKeywords = ['لون', 'ألوان', 'color', 'colors'];
    const isColorQuestion = colorKeywords.some(word => lowerQuestion.includes(word));

    let reply = '';
    if (foundProduct) {
      this.lastDiscussedProduct = foundProduct;
      
      if (isColorQuestion) {
        const brandMatch = this.products.filter(product => {
          const brandName = product.productBrand?.name?.toLowerCase() || '';
          return (
            brandName.includes(lowerQuestion) ||
            lowerQuestion.includes(brandName)
          );
        });
        if (brandMatch.length > 1) {
          let replyList = brandMatch.map(prod => {
            const colors = prod.colors && prod.colors.length > 0 ? prod.colors.join(', ') : (isArabicQuestion ? 'لا توجد ألوان محددة' : 'No specific colors');
            return isArabicQuestion ? `- ${prod.name}: ${colors}` : `- ${prod.name}: ${colors}`;
          });
          reply = isArabicQuestion ? `الألوان المتاحة لمنتجات ${brandMatch[0].productBrand.name} :\n${replyList.join('\n')}` : `Available colors for ${brandMatch[0].productBrand.name} products:\n${replyList.join('\n')}`;
        } else if (foundProduct.colors && foundProduct.colors.length > 0) {
          reply = isArabicQuestion ? `الألوان المتاحة لمنتج ${foundProduct.name}: ${foundProduct.colors.join(', ')}` : `Available colors for ${foundProduct.name}: ${foundProduct.colors.join(', ')}`;
        } else {
          reply = isArabicQuestion ? `لا توجد ألوان محددة لهذا المنتج (${foundProduct.name})` : `No specific colors for this product (${foundProduct.name})`;
        }
      } else {
        reply = isArabicQuestion ? `المنتج (${foundProduct.name}) موجود.` : `The product (${foundProduct.name}) is available.`;
      }
    } else {
      const hasProductRelatedWords = this.products.some(product => {
        const productName = product.name.toLowerCase();
        const brandName = product.productBrand?.name?.toLowerCase() || '';
        return lowerQuestion.includes(productName) || lowerQuestion.includes(brandName);
      });

      const productSpecificKeywords = ['watch', 'ساعة', 'product', 'منتج', 'available', 'موجود', 'exist', 'available?', 'موجودة؟'];
      const isProductSpecificQuestion = productSpecificKeywords.some(word => lowerQuestion.includes(word));

      if (!hasProductRelatedWords && !isProductSpecificQuestion) {
        const helpMessage = isArabicQuestion ? 
          `أهلاً! يمكنني مساعدتك في:\n` +
          `• البحث عن منتج معين (مثال: "ساعة رولكس موجودة؟")\n` +
          `• معرفة ألوان المنتج (مثال: "ألوان ساعة كاسيو")\n` +
          `• عرض جميع البراندات ("عندك إيه براندات؟")\n` +
          `• عرض منتجات براند معين ("جيبلي منتجات رولكس")\n` +
          `• معرفة سعر المنتج ("كم سعر الساعة؟")` :
          `Hello! I can help you with:\n` +
          `• Finding a specific product (example: "Is Rolex watch available?")\n` +
          `• Knowing product colors (example: "Casio watch colors")\n` +
          `• Showing all brands ("What brands do you have?")\n` +
          `• Showing brand products ("Show me Rolex products")\n` +
          `• Knowing product price ("How much is the watch?")`;
        
        this.chatHistory.push({ from: 'bot', message: helpMessage });
        this.question = '';
        this.loading = false;
        return;
      }

      if (isColorQuestion) {
        const brandMatch = this.products.filter(product => {
          const brandName = product.productBrand?.name?.toLowerCase() || '';
          return (
            brandName.includes(lowerQuestion) ||
            lowerQuestion.includes(brandName)
          );
        });
        if (brandMatch.length > 0) {
          let replyList = brandMatch.map(prod => {
            const colors = prod.colors && prod.colors.length > 0 ? prod.colors.join(', ') : (isArabicQuestion ? 'لا توجد ألوان محددة' : 'No specific colors');
            return isArabicQuestion ? `- ${prod.name}: ${colors}` : `- ${prod.name}: ${colors}`;
          });
          reply = isArabicQuestion ? `الألوان المتاحة لمنتجات ${brandMatch[0].productBrand.name} :\n${replyList.join('\n')}` : `Available colors for ${brandMatch[0].productBrand.name} products:\n${replyList.join('\n')}`;
        } else {
          reply = isArabicQuestion ? 'من فضلك حدد اسم المنتج الذي تريد معرفة ألوانه.' : 'Please specify the product name you want to know its colors.';
        }
      } else {
        reply = isArabicQuestion ? 'المنتج غير متوفر.' : 'The product is not available.';
      }
    }

    this.chatHistory.push({ from: 'bot', message: reply });
    this.question = '';
    this.loading = false;
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
    this.isOpen = false;
  }

  retrieveRelevantChunks(userQuestion: string): string[] {
  const lower = userQuestion.toLowerCase();

  const matchedProducts = this.products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(lower);
    const brandMatch = product.productBrand?.name.toLowerCase().includes(lower);
    const descMatch = product.description?.toLowerCase().includes(lower);
    return nameMatch || brandMatch || descMatch;
  });

  if (matchedProducts.length === 0) {
    return [
      'Ora Collective is an online store specializing in premium watches.',
      'We offer a variety of watches including waterproof sport watches, classic leather watches, and smartwatches.',
      'Products have availability status and warranty info.'
    ];
  }

  return matchedProducts.map(product => {
    return `Product: ${product.name}
Brand: ${product.productBrand?.name}
Description: ${product.description}
Price: $${product.price}
Available Quantity: ${product.quantity}
Category: ${product.category?.name}
Colors: ${product.colors?.join(', ')}
Sizes: ${product.sizes?.join(', ')}
Water Resistant: ${product.waterResistance ? 'Yes' : 'No'}
Warranty: ${product.warrentyYears} years`;
  });
}

  buildPrompt(question: string, context: string[]) {
    return [
      {
        role: 'system',
        content: 'You are a helpful assistant. Answer questions only based on the following product data from Ora Collective online store. If the product is not found, say it is not available.',
      },
      {
        role: 'user',
        content: `Context:\n${context.join('\n\n')}\n\nQuestion: ${question}`,
      },
    ];
  }
}
