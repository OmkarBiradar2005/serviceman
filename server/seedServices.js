import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';

// Load environment variables
dotenv.config();

// Sample services data - Prices in Indian Rupees, Locations in Maharashtra
const sampleServices = [
  // Cleaning (2)
  {
    title: 'Professional House Cleaning',
    description: 'Complete house cleaning service including all rooms, kitchen, and bathrooms. Deep cleaning available.',
    category: 'Cleaning',
    price: 4000,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Office Deep Cleaning',
    description: 'Comprehensive office cleaning including workstations, restrooms, and common areas.',
    category: 'Cleaning',
    price: 12000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  
  // Plumbing (2)
  {
    title: 'Emergency Plumbing Service',
    description: '24/7 plumbing services for all your emergency needs. Pipe repairs, leak fixing, and installations.',
    category: 'Plumbing',
    price: 6000,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Nagpur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Drain Cleaning Service',
    description: 'Professional drain cleaning and unclogging services for kitchens and bathrooms.',
    category: 'Plumbing',
    price: 5200,
    priceType: 'fixed',
    duration: 60,
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' }
  },
  
  // Electrical (2)
  {
    title: 'Electrical Wiring & Repairs',
    description: 'Licensed electrician for all electrical work. Wiring, circuit repairs, and appliance installation.',
    category: 'Electrical',
    price: 6400,
    priceType: 'hourly',
    duration: 90,
    location: { city: 'Aurangabad', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Home Electrical Inspection',
    description: 'Complete electrical safety inspection and certification for homes and businesses.',
    category: 'Electrical',
    price: 9600,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Thane', state: 'Maharashtra', country: 'India' }
  },
  
  // Carpentry (2)
  {
    title: 'Custom Furniture Carpentry',
    description: 'Expert carpenter for custom furniture, repairs, and wood installations.',
    category: 'Carpentry',
    price: 8000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Kolhapur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Door & Window Installation',
    description: 'Professional installation and repair of doors, windows, and frames. Precision work guaranteed.',
    category: 'Carpentry',
    price: 6800,
    priceType: 'hourly',
    duration: 150,
    location: { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' }
  },
  
  // Painting (2)
  {
    title: 'Interior & Exterior Painting',
    description: 'Professional painting services for homes and offices. Quality finishes guaranteed.',
    category: 'Painting',
    price: 16000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Solapur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Wall Texture & Design',
    description: 'Decorative wall painting, texture work, and custom designs for modern interiors.',
    category: 'Painting',
    price: 14400,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Amravati', state: 'Maharashtra', country: 'India' }
  },
  
  // Gardening (2)
  {
    title: 'Garden Maintenance & Landscaping',
    description: 'Complete garden care including lawn mowing, trimming, and landscaping design.',
    category: 'Gardening',
    price: 4800,
    priceType: 'fixed',
    duration: 150,
    location: { city: 'Sangli', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Plant Care & Tree Trimming',
    description: 'Expert plant care, tree pruning, and seasonal garden maintenance services.',
    category: 'Gardening',
    price: 6000,
    priceType: 'hourly',
    duration: 120,
    location: { city: 'Akola', state: 'Maharashtra', country: 'India' }
  },
  
  // AC Repair (2)
  {
    title: 'AC Installation & Repair',
    description: 'Air conditioning installation, maintenance, and emergency repair services.',
    category: 'AC Repair',
    price: 7200,
    priceType: 'hourly',
    duration: 120,
    location: { city: 'Latur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'AC Maintenance & Cleaning',
    description: 'Regular AC servicing, filter cleaning, and gas refilling for optimal cooling.',
    category: 'AC Repair',
    price: 4400,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Dhule', state: 'Maharashtra', country: 'India' }
  },
  
  // Appliance Repair (2)
  {
    title: 'Appliance Repair Service',
    description: 'Repair for all home appliances - refrigerators, washing machines, microwaves, and more.',
    category: 'Appliance Repair',
    price: 5600,
    priceType: 'hourly',
    duration: 90,
    location: { city: 'Ahmednagar', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Washing Machine Repair',
    description: 'Specialized washing machine and dryer repair service. Quick and reliable fixes.',
    category: 'Appliance Repair',
    price: 4800,
    priceType: 'fixed',
    duration: 75,
    location: { city: 'Chandrapur', state: 'Maharashtra', country: 'India' }
  },
  
  // Beauty & Salon (2)
  {
    title: 'Home Salon Services',
    description: 'Professional beauty services at your doorstep. Haircuts, styling, manicure, and pedicure.',
    category: 'Beauty & Salon',
    price: 3600,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Jalgaon', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Bridal Makeup & Styling',
    description: 'Expert bridal makeup, hair styling, and pre-wedding beauty services at home.',
    category: 'Beauty & Salon',
    price: 12000,
    priceType: 'fixed',
    duration: 150,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  
  // Pest Control (2)
  {
    title: 'Pest Control & Fumigation',
    description: 'Complete pest control solutions for homes and offices. Safe and effective treatments.',
    category: 'Pest Control',
    price: 9600,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Termite Treatment',
    description: 'Specialized termite inspection and treatment services. Long-lasting protection guaranteed.',
    category: 'Pest Control',
    price: 16000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Nagpur', state: 'Maharashtra', country: 'India' }
  },
  
  // Moving & Packing (2)
  {
    title: 'Professional Moving & Packing',
    description: 'Reliable moving and packing services for homes and offices. Careful handling guaranteed.',
    category: 'Moving & Packing',
    price: 24000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Local Shifting Service',
    description: 'Quick and affordable local moving service. Same-day service available.',
    category: 'Moving & Packing',
    price: 12000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Aurangabad', state: 'Maharashtra', country: 'India' }
  },
  
  // Photography (2)
  {
    title: 'Event Photography',
    description: 'Professional photography for weddings, parties, and corporate events. High-quality images.',
    category: 'Photography',
    price: 20000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Thane', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Portrait & Family Photography',
    description: 'Beautiful portraits and family photoshoots. Studio quality at your location.',
    category: 'Photography',
    price: 9600,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Kolhapur', state: 'Maharashtra', country: 'India' }
  },
  
  // Catering (2)
  {
    title: 'Catering Services',
    description: 'Delicious catering for all occasions. Custom menus available for parties and events.',
    category: 'Catering',
    price: 40000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Home Chef Service',
    description: 'Personal chef service for daily meals, party cooking, and special dietary requirements.',
    category: 'Catering',
    price: 8000,
    priceType: 'hourly',
    duration: 120,
    location: { city: 'Solapur', state: 'Maharashtra', country: 'India' }
  },

  // Additional Cleaning Services
  {
    title: 'Carpet & Upholstery Cleaning',
    description: 'Deep cleaning for carpets, sofas, and upholstery. Stain removal and sanitization included.',
    category: 'Cleaning',
    price: 6400,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Amravati', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Window Cleaning Service',
    description: 'Professional window cleaning for homes and offices. Streak-free shine guaranteed.',
    category: 'Cleaning',
    price: 3600,
    priceType: 'fixed',
    duration: 60,
    location: { city: 'Sangli', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Post-Construction Cleaning',
    description: 'Thorough cleaning after renovation or construction. Dust removal and debris clearing.',
    category: 'Cleaning',
    price: 20000,
    priceType: 'fixed',
    duration: 300,
    location: { city: 'Akola', state: 'Maharashtra', country: 'India' }
  },

  // Additional Plumbing Services
  {
    title: 'Water Heater Installation',
    description: 'Professional water heater installation, repair, and maintenance services.',
    category: 'Plumbing',
    price: 16000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Latur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Bathroom Renovation Plumbing',
    description: 'Complete plumbing services for bathroom renovations. Fixtures, pipes, and installations.',
    category: 'Plumbing',
    price: 7600,
    priceType: 'hourly',
    duration: 240,
    location: { city: 'Dhule', state: 'Maharashtra', country: 'India' }
  },

  // Additional Electrical Services
  {
    title: 'Smart Home Installation',
    description: 'Installation of smart switches, thermostats, and home automation systems.',
    category: 'Electrical',
    price: 12000,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Ahmednagar', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Ceiling Fan Installation',
    description: 'Professional ceiling fan installation and replacement. All brands supported.',
    category: 'Electrical',
    price: 4800,
    priceType: 'fixed',
    duration: 45,
    location: { city: 'Chandrapur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Outdoor Lighting Setup',
    description: 'Landscape and security lighting installation for exteriors. Energy-efficient options.',
    category: 'Electrical',
    price: 14400,
    priceType: 'fixed',
    duration: 150,
    location: { city: 'Jalgaon', state: 'Maharashtra', country: 'India' }
  },

  // Additional Carpentry Services
  {
    title: 'Kitchen Cabinet Installation',
    description: 'Custom kitchen cabinet design, installation, and repair services.',
    category: 'Carpentry',
    price: 24000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Deck Building & Repair',
    description: 'Outdoor deck construction, repair, and refinishing. Weather-resistant materials.',
    category: 'Carpentry',
    price: 8800,
    priceType: 'hourly',
    duration: 300,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },

  // Additional Painting Services
  {
    title: 'Cabinet Refinishing',
    description: 'Professional cabinet painting and refinishing. Transform your kitchen affordably.',
    category: 'Painting',
    price: 28000,
    priceType: 'fixed',
    duration: 300,
    location: { city: 'Nagpur', state: 'Maharashtra', country: 'India' }
  },

  // Additional Gardening Services
  {
    title: 'Irrigation System Installation',
    description: 'Automated sprinkler and irrigation system design and installation.',
    category: 'Gardening',
    price: 36000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' }
  },

  // Additional AC Repair Services
  {
    title: 'Duct Cleaning Service',
    description: 'HVAC duct cleaning for improved air quality and system efficiency.',
    category: 'AC Repair',
    price: 11200,
    priceType: 'fixed',
    duration: 150,
    location: { city: 'Aurangabad', state: 'Maharashtra', country: 'India' }
  },

  // Additional Appliance Repair
  {
    title: 'Refrigerator Repair',
    description: 'Expert refrigerator and freezer repair. All brands and models serviced.',
    category: 'Appliance Repair',
    price: 6000,
    priceType: 'hourly',
    duration: 90,
    location: { city: 'Thane', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Dishwasher Installation & Repair',
    description: 'Dishwasher installation, repair, and maintenance services.',
    category: 'Appliance Repair',
    price: 6800,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Kolhapur', state: 'Maharashtra', country: 'India' }
  },

  // Additional Beauty Services
  {
    title: 'Mens Grooming Service',
    description: 'Professional mens haircut, shaving, and grooming at your doorstep.',
    category: 'Beauty & Salon',
    price: 2800,
    priceType: 'fixed',
    duration: 45,
    location: { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' }
  },

  // Additional Photography
  {
    title: 'Product Photography',
    description: 'Professional product photography for e-commerce and marketing materials.',
    category: 'Photography',
    price: 14400,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Solapur', state: 'Maharashtra', country: 'India' }
  },

  // Tutoring Services
  {
    title: 'Math & Science Tutoring',
    description: 'Expert tutoring for school and college students. All levels covered.',
    category: 'Tutoring',
    price: 3200,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Amravati', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Language Learning Classes',
    description: 'Private language lessons - English, Marathi, Hindi. Online and in-person available.',
    category: 'Tutoring',
    price: 2800,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Sangli', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Music Lessons',
    description: 'Guitar, piano, and vocal training from experienced instructors.',
    category: 'Tutoring',
    price: 4000,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Akola', state: 'Maharashtra', country: 'India' }
  },

  // IT Support Services
  {
    title: 'Computer Repair & Support',
    description: 'PC and laptop repair, virus removal, and technical support services.',
    category: 'IT Support',
    price: 4800,
    priceType: 'hourly',
    duration: 90,
    location: { city: 'Latur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Network Setup & Installation',
    description: 'Home and office network installation, WiFi setup, and troubleshooting.',
    category: 'IT Support',
    price: 8000,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Dhule', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Data Recovery Service',
    description: 'Professional data recovery from hard drives, SSDs, and storage devices.',
    category: 'IT Support',
    price: 12000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Ahmednagar', state: 'Maharashtra', country: 'India' }
  },

  // Car Washing Services
  {
    title: 'Premium Car Wash & Detailing',
    description: 'Complete car washing, interior cleaning, and detailing at your location.',
    category: 'Car Wash',
    price: 6400,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Chandrapur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Express Car Wash',
    description: 'Quick exterior and interior car wash service. Convenient and affordable.',
    category: 'Car Wash',
    price: 2800,
    priceType: 'fixed',
    duration: 30,
    location: { city: 'Jalgaon', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Ceramic Coating Service',
    description: 'Professional ceramic coating for long-lasting car protection and shine.',
    category: 'Car Wash',
    price: 32000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },

  // Pet Care Services
  {
    title: 'Dog Walking Service',
    description: 'Daily dog walking and exercise. Reliable and caring pet handlers.',
    category: 'Pet Care',
    price: 2000,
    priceType: 'fixed',
    duration: 45,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Pet Grooming at Home',
    description: 'Professional pet grooming service for dogs and cats at your home.',
    category: 'Pet Care',
    price: 4400,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Nagpur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Pet Sitting Service',
    description: 'Reliable pet sitting when you are away. Feeding, walking, and care included.',
    category: 'Pet Care',
    price: 3200,
    priceType: 'fixed',
    duration: 60,
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' }
  },

  // Fitness Training
  {
    title: 'Personal Fitness Training',
    description: 'One-on-one fitness training at home. Customized workout plans.',
    category: 'Fitness',
    price: 4800,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Aurangabad', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Yoga Instruction',
    description: 'Private yoga sessions for beginners and advanced practitioners.',
    category: 'Fitness',
    price: 3600,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Thane', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Nutrition Consulting',
    description: 'Personalized meal planning and nutrition guidance from certified dietitians.',
    category: 'Fitness',
    price: 6400,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Kolhapur', state: 'Maharashtra', country: 'India' }
  },

  // Home Security
  {
    title: 'Security Camera Installation',
    description: 'CCTV and smart security camera installation for homes and businesses.',
    category: 'Home Security',
    price: 20000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Smart Lock Installation',
    description: 'Installation of keyless entry and smart lock systems.',
    category: 'Home Security',
    price: 9600,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Solapur', state: 'Maharashtra', country: 'India' }
  },

  // Locksmith Services
  {
    title: 'Emergency Locksmith',
    description: '24/7 emergency lockout service. Fast response for home, car, and office.',
    category: 'Locksmith',
    price: 6000,
    priceType: 'fixed',
    duration: 30,
    location: { city: 'Amravati', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Lock Installation & Repair',
    description: 'Professional lock installation, repair, and rekeying services.',
    category: 'Locksmith',
    price: 5200,
    priceType: 'fixed',
    duration: 45,
    location: { city: 'Sangli', state: 'Maharashtra', country: 'India' }
  },

  // Roofing Services
  {
    title: 'Roof Repair Service',
    description: 'Professional roof leak repair and maintenance. All roof types serviced.',
    category: 'Roofing',
    price: 16000,
    priceType: 'fixed',
    duration: 180,
    location: { city: 'Akola', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Roof Inspection',
    description: 'Comprehensive roof inspection and condition assessment.',
    category: 'Roofing',
    price: 8000,
    priceType: 'fixed',
    duration: 90,
    location: { city: 'Latur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Gutter Cleaning & Repair',
    description: 'Gutter cleaning, repair, and installation services.',
    category: 'Roofing',
    price: 6400,
    priceType: 'fixed',
    duration: 120,
    location: { city: 'Dhule', state: 'Maharashtra', country: 'India' }
  },

  // Flooring Services
  {
    title: 'Hardwood Floor Installation',
    description: 'Professional hardwood flooring installation and refinishing.',
    category: 'Flooring',
    price: 40000,
    priceType: 'fixed',
    duration: 360,
    location: { city: 'Ahmednagar', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Tile Installation',
    description: 'Ceramic, porcelain, and natural stone tile installation for floors and walls.',
    category: 'Flooring',
    price: 32000,
    priceType: 'fixed',
    duration: 300,
    location: { city: 'Chandrapur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Carpet Installation',
    description: 'Professional carpet installation with quality materials and craftsmanship.',
    category: 'Flooring',
    price: 28000,
    priceType: 'fixed',
    duration: 240,
    location: { city: 'Jalgaon', state: 'Maharashtra', country: 'India' }
  },

  // Auto Repair
  {
    title: 'Mobile Car Mechanic',
    description: 'On-site car repair and maintenance at your location. All makes and models.',
    category: 'Auto Repair',
    price: 6800,
    priceType: 'hourly',
    duration: 90,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Oil Change Service',
    description: 'Quick and convenient oil change service at your home or office.',
    category: 'Auto Repair',
    price: 3600,
    priceType: 'fixed',
    duration: 30,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' }
  },

  // Massage & Wellness
  {
    title: 'Therapeutic Massage',
    description: 'Professional therapeutic massage for stress relief and relaxation at home.',
    category: 'Wellness',
    price: 7200,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Nagpur', state: 'Maharashtra', country: 'India' }
  },
  {
    title: 'Physiotherapy Service',
    description: 'Home physiotherapy for injury recovery and pain management.',
    category: 'Wellness',
    price: 8000,
    priceType: 'hourly',
    duration: 60,
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' }
  }
];

const seedServices = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Seeding services...');

    // Find provider users (or create a default one)
    let providers = await User.find({ role: 'provider' });

    if (providers.length === 0) {
      console.log('No providers found. Creating a sample provider...');
      const sampleProvider = await User.create({
        name: 'Sample Provider',
        email: 'provider@example.com',
        password: 'password123',
        role: 'provider',
        phone: '9123456780',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        }
      });
      providers = [sampleProvider];
      console.log('Sample provider created!');
    }

    // Clear existing services
    await Service.deleteMany({});
    console.log('Existing services cleared.');

    // Create services with random providers
    const services = sampleServices.map(service => ({
      ...service,
      providerId: providers[Math.floor(Math.random() * providers.length)]._id,
      rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
      totalReviews: Math.floor(Math.random() * 20),
      availability: true,
      isActive: true
    }));

    await Service.insertMany(services);

    console.log(`✅ Successfully seeded ${services.length} services!`);
    console.log('Services added to the database.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

// Run the seed function
seedServices();
