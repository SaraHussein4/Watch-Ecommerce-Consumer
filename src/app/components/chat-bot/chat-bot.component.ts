import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

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

  HF_TOKEN = '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';
  PROVIDER = 'together';
  MODEL_ID = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
  API_URL = `https://router.huggingface.co/${this.PROVIDER}/v1/chat/completions`;

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {
    this.loadProductsFromDatabase();
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
      const foundBrand = this.products.find(product => {
        const brandName = product.productBrand?.name?.toLowerCase() || '';
        return lowerQuestion.includes(brandName);
      })?.productBrand?.name;

      if (foundBrand) {
        const brandProducts = this.products.filter(product => 
          product.productBrand?.name === foundBrand
        );
        
        if (brandProducts.length > 0) {
          const productsList = brandProducts.map(product => 
            `- ${product.name} - $${product.price}`
          ).join('\n');
          
          const reply = isArabicQuestion ? 
            `منتجات براند ${foundBrand}:\n${productsList}` : 
            `Products from ${foundBrand} brand:\n${productsList}`;
          
          this.chatHistory.push({ from: 'bot', message: reply });
          this.question = '';
          this.loading = false;
          return;
        }
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
