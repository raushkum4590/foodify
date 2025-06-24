import { request, gql } from 'graphql-request'; // Import with ES6 syntax

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; // Make sure this URL is set correctly in your .env

// Function to fetch categories
const GetCategory = async () => {
  const query = gql`
    query Categories {
      categories(first: 20) {
        slug
        name
        id
        icon {
          url
        }
      }
    }
  `;
  // Fallback categories for development/testing
  const fallbackCategories = [
    {
      id: '1',
      name: 'Burger',
      slug: 'burger',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '2',
      name: 'Pizza',
      slug: 'pizza',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '3',
      name: 'Dosa',
      slug: 'dosa',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '4',
      name: 'Ramen',
      slug: 'ramen',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '5',
      name: 'Sushi',
      slug: 'sushi',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '6',
      name: 'Chinese',
      slug: 'chinese',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '7',
      name: 'Mexican',
      slug: 'mexican',
      icon: { url: '/api/placeholder/50/50' }
    },
    {
      id: '8',
      name: 'Indian',
      slug: 'indian',
      icon: { url: '/api/placeholder/50/50' }
    }
  ];

  try {
    const result = await request(MASTER_URL, query);
    return result.categories; // Return only the categories array
  } catch (error) {
    console.error("Error fetching categories:", error);
    console.log("Using fallback categories for development");
    return fallbackCategories;
  }
};

// Function to fetch restaurants
const GetRestaurants = async () => {
  // Try a basic query first to see what fields are available
  const basicQuery = gql`
    query Restaurants {
      restaurants {
        id
        name
        slug
      }
    }
  `;

  const fullQuery = gql`
    query Restaurants {
      restaurants {
        about
        address
        banner {
          url
        }
        category {
          name
          slug
        }
        id
        name
        restroType
        slug
        workingHour
      }
    }
  `;
  // Fallback data for development/testing
  const fallbackData = [
    {
      id: '1',
      name: 'Burger King',
      slug: 'burger-king',
      category: { name: 'Burger', slug: 'burger' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Home of the Whopper - flame-grilled burgers and crispy fries',
      address: '123 Burger Street',
      restroType: 'Fast Food',
      workingHour: '10 AM - 10 PM'
    },
    {
      id: '2',
      name: 'McDonald\'s',
      slug: 'mcdonalds',
      category: { name: 'Burger', slug: 'burger' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'World-famous Big Mac and golden fries',
      address: '456 Fast Food Ave',
      restroType: 'Fast Food',
      workingHour: '24 Hours'
    },
    {
      id: '3',
      name: 'Five Guys',
      slug: 'five-guys',
      category: { name: 'Burger', slug: 'burger' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Fresh, never frozen beef burgers and hand-cut fries',
      address: '789 Gourmet Burger Lane',
      restroType: 'Gourmet Burgers',
      workingHour: '11 AM - 10 PM'
    },
    {
      id: '4',
      name: 'Pizza Palace',
      slug: 'pizza-palace',
      category: { name: 'Pizza', slug: 'pizza' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Authentic Italian pizza with fresh ingredients',
      address: '101 Pizza Ave',
      restroType: 'Italian',
      workingHour: '11 AM - 11 PM'
    },
    {
      id: '5',
      name: 'Domino\'s Pizza',
      slug: 'dominos-pizza',
      category: { name: 'Pizza', slug: 'pizza' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Hot, fresh pizza delivered in 30 minutes or less',
      address: '202 Pizza Street',
      restroType: 'Pizza Delivery',
      workingHour: '10 AM - 12 AM'
    },
    {
      id: '6',
      name: 'Ramen House',
      slug: 'ramen-house',
      category: { name: 'Ramen', slug: 'ramen' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Traditional Japanese ramen with rich, flavorful broth',
      address: '303 Noodle St',
      restroType: 'Japanese',
      workingHour: '12 PM - 9 PM'
    },
    {
      id: '7',
      name: 'Shake Shack',
      slug: 'shake-shack',
      category: { name: 'Burger', slug: 'burger' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Premium burgers, hot dogs, and hand-spun shakes',
      address: '404 Gourmet Street',
      restroType: 'Gourmet Fast Food',
      workingHour: '11 AM - 10 PM'
    },
    {
      id: '8',
      name: 'In-N-Out Burger',
      slug: 'in-n-out-burger',
      category: { name: 'Burger', slug: 'burger' },
      banner: { url: '/api/placeholder/400/200' },
      about: 'Fresh, never frozen burgers with secret menu options',
      address: '505 California Street',
      restroType: 'Regional Burger Chain',
      workingHour: '10:30 AM - 1 AM'    }
  ];

  try {console.log('Attempting to fetch restaurants with full query...');
    const result = await request(MASTER_URL, fullQuery);
    console.log('Full query successful:', result);
    return result.restaurants;
  } catch (error) {
    console.error("Full query failed, trying basic query:", error);
    
    try {
      console.log('Attempting basic query...');
      const basicResult = await request(MASTER_URL, basicQuery);
      console.log('Basic query successful:', basicResult);
        // If basic query works, return basic data but warn about missing fields
      console.warn('Only basic restaurant data available. Some features may not work properly.');
      return basicResult.restaurants.map(restaurant => ({
        ...restaurant,
        category: { name: 'Unknown', slug: 'unknown' },
        banner: { url: '/api/placeholder/400/200' },
        about: '',
        address: '',
        restroType: '',
        workingHour: ''
      }));
    } catch (basicError) {
      console.error("Both queries failed, using fallback data:", basicError);
      console.warn('Using fallback restaurant data for development. Please check your Hygraph configuration.');
      return fallbackData;
    }
  }
};


const GetRestaurantDetails = async (RestaurantSlug) => {
  const query = gql`
    query RestaurantDetails($slug: String!) {
      restaurant(where: { slug: $slug }) {
        about
        address
        banner {
          url
        }
        category {
          name
        }
        id
        name
        restroType
        slug
        workingHour
        menu {
          ... on Menu {
            id
            category
            menuItem {
              ... on MenuItem {
                id
                name
                price
                productImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {    const result = await request(MASTER_URL, query, { slug: RestaurantSlug }); // Pass slug as variable
    return result.restaurant; // Return the restaurant details
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    throw error; // Propagate error for handling in the calling component
  }
};

// Function to create user cart
// Function to create user cart
const GetUserCart = async (data) => {
  const mutation = gql`
    mutation AddToCart($email: String!, $price: Float!, $description: String!, $image: String!, $name: String!) {
      createUserCart(
        data: {
          email: $email, 
          price: $price, 
          productDescription: $description, 
          productImage: $image, 
          productName: $name,
          
        }
      ) {
        id
        history { 
          id 
        }
      }
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    email: data.email,
    price: data.price,
    description: data.description,
    image: data.image,
    name: data.name ,
    // Added productName to the variables
  };

  // Log the mutation and variables for debugging
  console.log("Mutation:", mutation);
  console.log("Variables:", variables);

  try {
    const result = await request(MASTER_URL, mutation, variables);
    return result.createUserCart; // Return the cart details
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error; // Propagate error for handling in the calling component
  }
};

// Function to search restaurants by name or category
const SearchRestaurants = async (searchTerm) => {
  const query = gql`
    query SearchRestaurants($searchTerm: String!) {
      restaurants(where: { 
        OR: [
          { name_contains: $searchTerm },
          { category: { name_contains: $searchTerm } }
        ]
      }) {
        about
        address
        banner {
          url
        }
        category {
          name
        }
        id
        name
        restroType
        slug
        workingHour
      }
    }
  `;

  try {    const result = await request(MASTER_URL, query, { searchTerm });
    return result.restaurants;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};

// Function to get restaurants by category
const GetRestaurantsByCategory = async (categorySlug) => {  // If categorySlug is null or "all", return all restaurants
  if (!categorySlug || categorySlug === 'all' || categorySlug === null) {
    console.log('Fetching all restaurants...');
    return await GetRestaurants();
  }
  const query = gql`
    query RestaurantsByCategory($categorySlug: String!) {
      restaurants(where: { category: { slug: $categorySlug } }) {
        about
        address
        banner {
          url
        }
        category {
          name
          slug
        }
        id
        name
        restroType
        slug
        workingHour
      }
    }
  `;

  try {    const result = await request(MASTER_URL, query, { categorySlug });
    console.log(`GraphQL query result for category "${categorySlug}":`, result.restaurants);
    return result.restaurants;
  } catch (error) {
    console.error("Error fetching restaurants by category:", error);
    
    // Fallback: Get all restaurants and filter on the client side
    console.log("Falling back to client-side filtering...");
    try {
      const allRestaurants = await GetRestaurants();
      console.log("All restaurants loaded:", allRestaurants);
      
      // Enhanced filtering logic
      const filteredRestaurants = allRestaurants.filter(restaurant => {
        if (!restaurant.category) {
          console.log(`Restaurant "${restaurant.name}" has no category`);
          return false;
        }
        
        const categoryName = restaurant.category.name?.toLowerCase() || '';
        const categorySlugFromData = restaurant.category.slug?.toLowerCase() || '';
        const restaurantName = restaurant.name?.toLowerCase() || '';
        const searchSlug = categorySlug.toLowerCase();
        
        console.log(`Checking restaurant "${restaurant.name}":`, {
          categoryName,
          categorySlugFromData,
          searchSlug,
          restaurantName
        });
          // Enhanced matching strategies with priority
        const matches = (
          // Priority 1: Exact category slug match
          categorySlugFromData === searchSlug ||
          
          // Priority 2: Exact category name match
          categoryName === searchSlug ||
          
          // Priority 3: Specific burger filtering (strict)
          (searchSlug === 'burger' && (
            categorySlugFromData === 'burger' ||
            categoryName.toLowerCase() === 'burger' ||
            categoryName.toLowerCase() === 'burgers' ||
            categoryName.toLowerCase().includes('burger') ||
            // Only include burger-specific restaurants by name
            (restaurantName.includes('burger') && 
             !restaurantName.includes('pizza') && 
             !restaurantName.includes('ramen') && 
             !restaurantName.includes('sushi'))
          )) ||
          
          // Priority 4: Other specific category matches
          (searchSlug === 'pizza' && (
            categorySlugFromData === 'pizza' ||
            categoryName.toLowerCase() === 'pizza' ||
            categoryName.toLowerCase().includes('pizza') ||
            restaurantName.includes('pizza')
          )) ||
          
          (searchSlug === 'ramen' && (
            categorySlugFromData === 'ramen' ||
            categoryName.toLowerCase() === 'ramen' ||
            categoryName.toLowerCase().includes('ramen') ||
            categoryName.toLowerCase().includes('noodle') ||
            restaurantName.includes('ramen')
          )) ||
          
          (searchSlug === 'sushi' && (
            categorySlugFromData === 'sushi' ||
            categoryName.toLowerCase() === 'sushi' ||
            categoryName.toLowerCase().includes('sushi') ||
            restaurantName.includes('sushi')
          )) ||
          
          // Generic name-based matching (only if no specific category rules apply)
          (!['burger', 'pizza', 'ramen', 'sushi'].includes(searchSlug) && (
            categoryName.includes(searchSlug) ||
            searchSlug.includes(categoryName) ||
            restaurantName.includes(searchSlug)
          ))
        );
        
        if (matches) {
          console.log(`✅ Restaurant "${restaurant.name}" matches category "${searchSlug}"`);
        }
        
        return matches;
      });
      
      console.log(`Filtered ${filteredRestaurants.length} restaurants for category: ${categorySlug}`, filteredRestaurants.map(r => r.name));
      return filteredRestaurants;
    } catch (fallbackError) {
      console.error("Fallback filtering also failed:", fallbackError);
      // Return empty array instead of throwing error to prevent app crash
      return [];
    }
  }
};

// Function to add to favorites
const AddToFavorites = async (data) => {
  console.log('AddToFavorites called - version 2025-06-23-v2');
  
  // Since the userFavorites table doesn't exist in the backend, simulate success
  // This prevents the GraphQL error from occurring
  console.log('UserFavorites table not yet configured in backend, simulating success');
  return { id: 'mock-favorite-' + Date.now() };
  
  // TODO: Uncomment this when the userFavorites table is properly configured in Hygraph
  /*
  const mutation = gql`
    mutation AddToFavorites($email: String!, $restaurantId: String!, $restaurantName: String!) {
      createUserFavorite(
        data: {
          email: $email,
          restaurantId: $restaurantId,
          restaurantName: $restaurantName
        }
      ) {
        id
      }
      publishManyUserFavorites(to: PUBLISHED) {
        count
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, mutation, data);
    return result.createUserFavorite;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    // If userFavorites table doesn't exist, just log and return success response
    if (error.message?.includes('400') || error.message?.includes('userFavorite')) {
      console.log('UserFavorites table not configured in backend, simulating success');
      return { id: 'mock-favorite-' + Date.now() };
    }
    throw error;
  }
  */
};

// Function to get user favorites
const GetUserFavorites = async (email) => {
  console.log('GetUserFavorites called - version 2025-06-23-v2');
  
  // Since the userFavorites table doesn't exist in the backend, return empty array directly
  // This prevents the GraphQL error from occurring
  console.log('UserFavorites table not yet configured in backend, returning empty array');
  return [];
  
  // TODO: Uncomment this when the userFavorites table is properly configured in Hygraph
  /*
  const query = gql`
    query GetUserFavorites($email: String!) {
      userFavorites(where: { email: $email }) {
        id
        restaurantId
        restaurantName
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { email });
    return result.userFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    // If userFavorites table doesn't exist, return empty array instead of throwing
    if (error.message?.includes('400') || error.message?.includes('userFavorites')) {
      console.log('UserFavorites table not configured in backend, returning empty array');
      return [];
    }
    throw error;
  }
  */
};

// Function to create order
const CreateOrder = async (orderData) => {
  console.log('🔍 CREATE ORDER - Function called with data:', orderData);
  console.log('🔍 CREATE ORDER - Order email:', orderData.email);
  console.log('🔍 CREATE ORDER - Order total:', orderData.total);
  console.log('🔍 CREATE ORDER - Restaurant name:', orderData.restaurantName);
  
  const mutation = gql`
    mutation CreateOrder($email: String!, $items: String!, $total: Float!, $restaurantName: String!, $deliveryInfo: String!, $paymentMethod: String!) {
      createOrder(
        data: {
          email: $email,
          items: $items,
          total: $total,
          restaurantName: $restaurantName,
          deliveryInfo: $deliveryInfo,
          paymentMethod: $paymentMethod
        }
      ) {
        id
        email
        total
        restaurantName
        createdAt
        items
        deliveryInfo
        paymentMethod
      }
      publishOrder(where: { email: $email }, to: PUBLISHED) {
        id
      }
    }
  `;

  // Prepare variables
  const variables = {  
    email: orderData.email,
    items: orderData.items,
    total: orderData.total,
    restaurantName: orderData.restaurantName,
    deliveryInfo: orderData.deliveryInfo,
    paymentMethod: orderData.paymentMethod
  };

  console.log('🔍 CREATE ORDER - GraphQL variables:', variables);

  try {
    console.log('🔍 CREATE ORDER - Sending mutation to Hygraph...');
    const result = await request(MASTER_URL, mutation, variables);
    console.log('✅ CREATE ORDER - Order created successfully:', result.createOrder);
    console.log('✅ CREATE ORDER - Publish result:', result.publishOrder);
    
    return result.createOrder;
  } catch (error) {
    console.error('❌ CREATE ORDER - Error creating order:', error);
    console.error('❌ CREATE ORDER - Error details:', error.message);
    console.error('❌ CREATE ORDER - Full error object:', error);
    
    // If the combined mutation fails, try creating without publishing
    console.log('🔄 CREATE ORDER - Trying to create order without auto-publish...');
    
    const simpleCreateMutation = gql`
      mutation CreateOrderSimple($email: String!, $items: String!, $total: Float!, $restaurantName: String!, $deliveryInfo: String!, $paymentMethod: String!) {
        createOrder(
          data: {
            email: $email,
            items: $items,
            total: $total,
            restaurantName: $restaurantName,
            deliveryInfo: $deliveryInfo,
            paymentMethod: $paymentMethod
          }
        ) {
          id
          email
          total
          restaurantName
          createdAt
          items
          deliveryInfo
          paymentMethod
        }
      }
    `;
    
    try {
      const simpleResult = await request(MASTER_URL, simpleCreateMutation, variables);
      console.log('✅ CREATE ORDER - Order created as draft:', simpleResult.createOrder);
      console.log('ℹ️ CREATE ORDER - Note: Order saved as draft since autopublish is not enabled');
      
      return simpleResult.createOrder;
    } catch (simpleError) {
      console.error('❌ CREATE ORDER - Failed to create order even as draft:', simpleError);
      
      // Check if this is a schema/configuration error
      if (simpleError.message?.includes('createOrder') && simpleError.message?.includes('400')) {
        console.log('❌ CREATE ORDER - Orders schema not configured in Hygraph backend');
        throw new Error('Orders feature not yet configured. Please check your Hygraph schema.');
      }
      
      throw simpleError;
    }
  }
};

// Function to get user orders
const GetUserOrders = async (email) => {
  console.log('GetUserOrders called for email:', email);
  
  // Get user-specific orders (including drafts since Hygraph may not auto-publish)
  const query = gql`
    query GetUserOrders($email: String!) {
      orders(where: { email: $email }, orderBy: createdAt_DESC, stage: DRAFT) {
        id
        items
        total
        restaurantName
        createdAt
        deliveryInfo
        paymentMethod
        email
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { email });
    console.log('Successfully fetched user orders:', result.orders?.length || 0, 'orders found');
    return result.orders || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    
    // Check if this is a schema/configuration error
    if (error.message?.includes('orders') && error.message?.includes('400')) {
      console.log('Orders table not yet configured in Hygraph backend');
      throw new Error('Orders feature not yet configured. Please check your Hygraph schema.');
    }
    
    throw error;
  }
};

// Function to add review
const AddReview = async (reviewData) => {
  console.log('AddReview called - version 2025-06-23-v2');
  
  // Since the reviews table doesn't exist in the backend, simulate success
  // This prevents the GraphQL error from occurring
  console.log('Reviews table not yet configured in backend, simulating success');
  return { 
    id: 'mock-review-' + Date.now(), 
    rating: reviewData.rating,
    comment: reviewData.comment,
    userName: reviewData.userName,
    createdAt: new Date().toISOString()
  };
  
  // TODO: Uncomment this when the reviews table is properly configured in Hygraph
  /*
  const mutation = gql`
    mutation AddReview($email: String!, $restaurantId: String!, $rating: Int!, $comment: String!, $userName: String!) {
      createReview(
        data: {
          email: $email,
          restaurantId: $restaurantId,
          rating: $rating,
          comment: $comment,
          userName: $userName
        }
      ) {
        id
        rating
        comment
        userName
        createdAt
      }
      publishManyReviews(to: PUBLISHED) {
        count
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, mutation, reviewData);
    return result.createReview;
  } catch (error) {
    console.error("Error adding review:", error);
    // If reviews table doesn't exist, just log and return success response
    if (error.message?.includes('400') || error.message?.includes('Review')) {
      console.log('Reviews table not configured in backend, simulating success');
      return { 
        id: 'mock-review-' + Date.now(), 
        rating: reviewData.rating,
        comment: reviewData.comment,
        userName: reviewData.userName,
        createdAt: new Date().toISOString()
      };
    }
    throw error;
  }
  */
};

// Function to get restaurant reviews
const GetRestaurantReviews = async (restaurantId) => {
  console.log('GetRestaurantReviews called - version 2025-06-23-v2');
  
  // Since the reviews table doesn't exist in the backend, return empty array directly
  // This prevents the GraphQL error from occurring
  console.log('Reviews table not yet configured in backend, returning empty array');
  return [];
  
  // TODO: Uncomment this when the reviews table is properly configured in Hygraph
  /*
  const query = gql`
    query GetRestaurantReviews($restaurantId: String!) {
      reviews(where: { restaurantId: $restaurantId }, orderBy: createdAt_DESC) {
        id
        rating
        comment
        userName
        createdAt
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query, { restaurantId });
    return result.reviews;
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    // If reviews table doesn't exist, return empty array instead of throwing
    if (error.message?.includes('400') || error.message?.includes('reviews')) {
      console.log('Reviews table not configured in backend, returning empty array');
      return [];
    }
    throw error;
  }
  */
};

export default {
  GetCategory,
  GetRestaurants,
  GetRestaurantDetails,
  GetUserCart,
  SearchRestaurants,
  GetRestaurantsByCategory,
  AddToFavorites,
  GetUserFavorites,
  CreateOrder,
  GetUserOrders,
  AddReview,
  GetRestaurantReviews,
};
