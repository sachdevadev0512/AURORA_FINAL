const User = require('../models/User');
const SellerApplication = require('../models/SellerApplication');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Ensures the default account rawyalusa@gmail.com exists with password 123456
 * and is fully configured as an active Amazon SP-API and Ads connected seller.
 */
async function seedDefaultUser() {
  try {
    const email = 'rawyalusa@gmail.com';
    const password = '123456';
    const amazonSellerId = 'A2EUQ1WTGCTBG2';
    const mockRefreshToken = 'Atzr|IwEBIMockBetaRefreshTokenRawyalUSA1234567890';
    const mockAdsToken = 'Atzr|IwEBIMockBetaAdsRefreshTokenRawyalUSA1234567890';

    // 1. Ensure User exists
    let user = await User.findOne({ email }).select('+password');

    const connectedFields = {
      name: 'Rawyal USA',
      role: 'seller',
      marketplace: 'NA',
      amazonMarketplaceIds: ['ATVPDKIKX0DER'],
      amazonSellerId,
      amazonRefreshToken: mockRefreshToken,
      amazonTokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isVerified: true,
      orderNotificationsEnabled: true,
      orderNotificationsSubscribedAt: new Date(),
      amazonAdsRefreshToken: mockAdsToken,
      amazonAdsAccountId: amazonSellerId,
      amazonAdsProfileIds: ['294819284719283'],
      lastAdsSyncedAt: new Date(),
      lastAdsMetricsSyncedAt: new Date(),
    };

    if (!user) {
      user = await User.create({
        email,
        password,
        ...connectedFields,
      });
      console.log(`[Seed] Successfully initialized connected account: ${email}`);
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.password = password;
      }
      Object.assign(user, connectedFields);
      await user.save();
      console.log(`[Seed] Synchronized SP-API connection credentials for account: ${email}`);
    }

    // 2. Ensure SellerApplication exists and is linked
    let sellerApp = await SellerApplication.findOne({ organizationName: 'Rawyal USA' });
    if (!sellerApp) {
      sellerApp = await SellerApplication.create({
        organizationName: 'Rawyal USA',
        organizationDescription: 'Rawyal USA Amazon SP-API Beta Integration',
        amazonClientId: 'amzn1.application-oa2-client.rawyalbeta12345',
        amazonClientSecret: 'amzn1.oa2-cs.v1.rawyalbeta1234567890',
        amazonApplicationId: 'amzn1.sp.solution.rawyalbeta',
        amazonLwaClientId: 'amzn1.application-oa2-client.rawyalbeta12345',
        amazonLwaClientSecret: 'amzn1.oa2-cs.v1.rawyalbeta1234567890',
        redirectUri: process.env.AMAZON_REDIRECT_URI || 'http://localhost:5000/api/auth/amazon/callback',
        supportedRegions: ['NA'],
        createdBy: user._id,
        isActive: true,
      });
      console.log('[Seed] Created default SellerApplication for Rawyal USA');
    }

    if (!user.sellerApplicationId || String(user.sellerApplicationId) !== String(sellerApp._id)) {
      user.sellerApplicationId = sellerApp._id;
      await user.save();
    }

    // 3. Seed sample products if none exist for this seller
    const productCount = await Product.countDocuments({ sellerId: user._id });
    if (productCount === 0) {
      const sampleProducts = [
        {
          sellerId: user._id,
          asin: 'B08N5KXYZ1',
          sku: 'RAWYAL-ARGAN-100ML',
          fnSku: 'X002A1B2C3',
          title: 'Rawyal Organic Cold Pressed Argan Oil 100ml - Pure Moroccan Elixir',
          price: { amount: 24.99, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 19.99, currency: 'USD' },
          maximumPrice: { amount: 29.99, currency: 'USD' },
          lowestPrice: { amount: 24.50, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 24.99, currency: 'USD' } },
          fees: {
            totalFees: { amount: 6.85, currency: 'USD' },
            referralFee: { amount: 3.75, currency: 'USD' },
            fbaFee: { amount: 3.10, currency: 'USD' },
          },
          inventory: {
            quantity: 340,
            totalQuantity: 340,
            fulfillableQuantity: 315,
            reservedQuantity: 25,
            inboundQuantity: 150,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Beauty & Personal Care',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 420,
        },
        {
          sellerId: user._id,
          asin: 'B09M7L4ABC',
          sku: 'RAWYAL-LTHR-MSGR',
          fnSku: 'X003D4E5F6',
          title: 'Rawyal Handcrafted Full Grain Leather Messenger Bag 15-inch Laptop Case',
          price: { amount: 129.99, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 110.00, currency: 'USD' },
          maximumPrice: { amount: 149.99, currency: 'USD' },
          lowestPrice: { amount: 128.00, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 129.99, currency: 'USD' } },
          fees: {
            totalFees: { amount: 28.50, currency: 'USD' },
            referralFee: { amount: 19.50, currency: 'USD' },
            fbaFee: { amount: 9.00, currency: 'USD' },
          },
          inventory: {
            quantity: 85,
            totalQuantity: 85,
            fulfillableQuantity: 78,
            reservedQuantity: 7,
            inboundQuantity: 50,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Luggage & Travel Gear',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 92,
        },
        {
          sellerId: user._id,
          asin: 'B08K9P2DEF',
          sku: 'RAWYAL-SLIM-WALLET',
          fnSku: 'X004G7H8I9',
          title: 'Rawyal Minimalist Slim Leather Wallet with RFID Blocking Front Pocket',
          price: { amount: 34.50, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 28.00, currency: 'USD' },
          maximumPrice: { amount: 39.99, currency: 'USD' },
          lowestPrice: { amount: 33.99, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 34.50, currency: 'USD' } },
          fees: {
            totalFees: { amount: 8.20, currency: 'USD' },
            referralFee: { amount: 5.18, currency: 'USD' },
            fbaFee: { amount: 3.02, currency: 'USD' },
          },
          inventory: {
            quantity: 520,
            totalQuantity: 520,
            fulfillableQuantity: 495,
            reservedQuantity: 25,
            inboundQuantity: 200,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Clothing, Shoes & Jewelry',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 880,
        },
        {
          sellerId: user._id,
          asin: 'B07X8M1GHI',
          sku: 'RAWYAL-BEARD-KIT',
          fnSku: 'X005J1K2L3',
          title: 'Rawyal Premium Beard Grooming Kit & Organic Conditioning Balm',
          price: { amount: 29.99, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 24.99, currency: 'USD' },
          maximumPrice: { amount: 34.99, currency: 'USD' },
          lowestPrice: { amount: 29.50, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 29.99, currency: 'USD' } },
          fees: {
            totalFees: { amount: 7.60, currency: 'USD' },
            referralFee: { amount: 4.50, currency: 'USD' },
            fbaFee: { amount: 3.10, currency: 'USD' },
          },
          inventory: {
            quantity: 210,
            totalQuantity: 210,
            fulfillableQuantity: 198,
            reservedQuantity: 12,
            inboundQuantity: 100,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Beauty & Personal Care',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 310,
        },
        {
          sellerId: user._id,
          asin: 'B09V2R5JKL',
          sku: 'RAWYAL-ROSEHIP-60ML',
          fnSku: 'X006M4N5O6',
          title: 'Rawyal Pure Unrefined Rosehip Seed Oil for Face & Skin 60ml',
          price: { amount: 19.99, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 16.50, currency: 'USD' },
          maximumPrice: { amount: 23.99, currency: 'USD' },
          lowestPrice: { amount: 19.99, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 19.99, currency: 'USD' } },
          fees: {
            totalFees: { amount: 5.80, currency: 'USD' },
            referralFee: { amount: 3.00, currency: 'USD' },
            fbaFee: { amount: 2.80, currency: 'USD' },
          },
          inventory: {
            quantity: 410,
            totalQuantity: 410,
            fulfillableQuantity: 390,
            reservedQuantity: 20,
            inboundQuantity: 250,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Beauty & Personal Care',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 560,
        },
        {
          sellerId: user._id,
          asin: 'B08Y3S6MNO',
          sku: 'RAWYAL-DUFFEL-BAG',
          fnSku: 'X007P7Q8R9',
          title: 'Rawyal Vintage Canvas & Full Grain Leather Travel Weekend Duffel',
          price: { amount: 89.00, currency: 'USD' },
          shippingCost: { amount: 0, currency: 'USD' },
          minimumPrice: { amount: 79.00, currency: 'USD' },
          maximumPrice: { amount: 99.00, currency: 'USD' },
          lowestPrice: { amount: 87.50, currency: 'USD' },
          featuredOffer: { isBuyBox: true, price: { amount: 89.00, currency: 'USD' } },
          fees: {
            totalFees: { amount: 20.40, currency: 'USD' },
            referralFee: { amount: 13.35, currency: 'USD' },
            fbaFee: { amount: 7.05, currency: 'USD' },
          },
          inventory: {
            quantity: 115,
            totalQuantity: 115,
            fulfillableQuantity: 108,
            reservedQuantity: 7,
            inboundQuantity: 60,
            fulfillmentChannel: 'DEFAULT',
          },
          fulfillmentType: 'FBA',
          category: 'Luggage & Travel Gear',
          brand: 'Rawyal',
          status: 'Active',
          unitsSold: 145,
        },
      ];

      await Product.insertMany(sampleProducts);
      console.log(`[Seed] Seeded ${sampleProducts.length} sample Amazon products for ${email}`);
    }

    // 4. Seed sample orders if none exist for this seller
    const orderCount = await Order.countDocuments({ sellerId: user._id });
    if (orderCount === 0) {
      const now = new Date();
      const sampleOrders = [
        {
          sellerId: user._id,
          amazonOrderId: '114-7294819-3849102',
          purchaseDate: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          lastUpdateDate: now,
          orderStatus: 'Shipped',
          fulfillmentChannel: 'AFN',
          salesChannel: 'Amazon.com',
          orderTotal: { amount: 49.98, currencyCode: 'USD' },
          numberOfItemsShipped: 2,
          numberOfItemsUnshipped: 0,
          paymentMethod: 'Other',
          marketplaceId: 'ATVPDKIKX0DER',
          buyerEmail: 'customer1@marketplace.amazon.com',
          buyerName: 'James Wilson',
          orderItems: [
            {
              asin: 'B08N5KXYZ1',
              sellerSku: 'RAWYAL-ARGAN-100ML',
              title: 'Rawyal Organic Cold Pressed Argan Oil 100ml',
              quantityOrdered: 2,
              quantityShipped: 2,
              itemPrice: { amount: 49.98, currencyCode: 'USD' },
            },
          ],
        },
        {
          sellerId: user._id,
          amazonOrderId: '112-4829103-9182341',
          purchaseDate: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
          lastUpdateDate: now,
          orderStatus: 'Unshipped',
          fulfillmentChannel: 'AFN',
          salesChannel: 'Amazon.com',
          orderTotal: { amount: 129.99, currencyCode: 'USD' },
          numberOfItemsShipped: 0,
          numberOfItemsUnshipped: 1,
          paymentMethod: 'Other',
          marketplaceId: 'ATVPDKIKX0DER',
          buyerEmail: 'customer2@marketplace.amazon.com',
          buyerName: 'Emily Carter',
          orderItems: [
            {
              asin: 'B09M7L4ABC',
              sellerSku: 'RAWYAL-LTHR-MSGR',
              title: 'Rawyal Handcrafted Full Grain Leather Messenger Bag',
              quantityOrdered: 1,
              quantityShipped: 0,
              itemPrice: { amount: 129.99, currencyCode: 'USD' },
            },
          ],
        },
        {
          sellerId: user._id,
          amazonOrderId: '113-5819302-8391029',
          purchaseDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
          lastUpdateDate: now,
          orderStatus: 'Shipped',
          fulfillmentChannel: 'AFN',
          salesChannel: 'Amazon.com',
          orderTotal: { amount: 34.50, currencyCode: 'USD' },
          numberOfItemsShipped: 1,
          numberOfItemsUnshipped: 0,
          paymentMethod: 'Other',
          marketplaceId: 'ATVPDKIKX0DER',
          buyerEmail: 'customer3@marketplace.amazon.com',
          buyerName: 'Michael Brown',
          orderItems: [
            {
              asin: 'B08K9P2DEF',
              sellerSku: 'RAWYAL-SLIM-WALLET',
              title: 'Rawyal Minimalist Slim Leather Wallet with RFID',
              quantityOrdered: 1,
              quantityShipped: 1,
              itemPrice: { amount: 34.50, currencyCode: 'USD' },
            },
          ],
        },
        {
          sellerId: user._id,
          amazonOrderId: '111-9283741-2837194',
          purchaseDate: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
          lastUpdateDate: now,
          orderStatus: 'Shipped',
          fulfillmentChannel: 'AFN',
          salesChannel: 'Amazon.com',
          orderTotal: { amount: 118.99, currencyCode: 'USD' },
          numberOfItemsShipped: 2,
          numberOfItemsUnshipped: 0,
          paymentMethod: 'Other',
          marketplaceId: 'ATVPDKIKX0DER',
          buyerEmail: 'customer4@marketplace.amazon.com',
          buyerName: 'David Lee',
          orderItems: [
            {
              asin: 'B08Y3S6MNO',
              sellerSku: 'RAWYAL-DUFFEL-BAG',
              title: 'Rawyal Vintage Canvas & Full Grain Leather Travel Duffel',
              quantityOrdered: 1,
              quantityShipped: 1,
              itemPrice: { amount: 89.00, currencyCode: 'USD' },
            },
            {
              asin: 'B07X8M1GHI',
              sellerSku: 'RAWYAL-BEARD-KIT',
              title: 'Rawyal Premium Beard Grooming Kit & Organic Conditioning Balm',
              quantityOrdered: 1,
              quantityShipped: 1,
              itemPrice: { amount: 29.99, currencyCode: 'USD' },
            },
          ],
        },
        {
          sellerId: user._id,
          amazonOrderId: '114-1928374-9821734',
          purchaseDate: new Date(now.getTime() - 72 * 60 * 60 * 1000), // 3 days ago
          lastUpdateDate: now,
          orderStatus: 'Shipped',
          fulfillmentChannel: 'AFN',
          salesChannel: 'Amazon.com',
          orderTotal: { amount: 39.98, currencyCode: 'USD' },
          numberOfItemsShipped: 2,
          numberOfItemsUnshipped: 0,
          paymentMethod: 'Other',
          marketplaceId: 'ATVPDKIKX0DER',
          buyerEmail: 'customer5@marketplace.amazon.com',
          buyerName: 'Sarah Jenkins',
          orderItems: [
            {
              asin: 'B09V2R5JKL',
              sellerSku: 'RAWYAL-ROSEHIP-60ML',
              title: 'Rawyal Pure Unrefined Rosehip Seed Oil for Face & Skin 60ml',
              quantityOrdered: 2,
              quantityShipped: 2,
              itemPrice: { amount: 39.98, currencyCode: 'USD' },
            },
          ],
        },
      ];

      await Order.insertMany(sampleOrders);
      console.log(`[Seed] Seeded ${sampleOrders.length} sample Amazon orders for ${email}`);
    }

    return user;
  } catch (error) {
    console.error('[Seed] Failed to ensure default user:', error.message);
  }
}

module.exports = { seedDefaultUser };
