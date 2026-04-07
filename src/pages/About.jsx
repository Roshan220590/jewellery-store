import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">About R&S Jewellery</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <p className="text-gray-600 leading-relaxed mb-6">
            Welcome to R&S Jewellery, your premier destination for high-quality imitation jewellery that combines traditional craftsmanship with contemporary design. Founded with a passion for making beautiful jewellery accessible to everyone, we've been serving customers across India with our carefully curated collections.
          </p>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Our journey began with a simple mission: to create stunning jewellery pieces that capture the essence of Indian traditions while meeting modern fashion sensibilities. Each piece in our collection is thoughtfully designed and crafted with attention to detail, ensuring you receive jewellery that's not just beautiful but also durable and comfortable to wear.
          </p>
          
          <p className="text-gray-600 leading-relaxed">
            From bridal sets that make your special day unforgettable to everyday pieces that add sparkle to your routine, we offer something for every occasion and every budget. Our commitment to quality, affordability, and customer satisfaction has made us a trusted name in the imitation jewellery industry.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">10,000+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
            <p className="text-gray-600">Unique Designs</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">4.8★</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">We never compromise on quality. All our jewellery pieces undergo strict quality checks to ensure they meet our high standards for durability and finish.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Affordable Luxury</h3>
              <p className="text-gray-600">Beautiful jewellery shouldn't break the bank. We work directly with manufacturers to offer you premium designs at prices you'll love.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">Your happiness is our priority. From easy returns to responsive customer support, we're here to make your shopping experience delightful.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Traditional Meets Modern</h3>
              <p className="text-gray-600">We celebrate India's rich jewellery traditions while embracing contemporary designs that appeal to the modern woman.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
