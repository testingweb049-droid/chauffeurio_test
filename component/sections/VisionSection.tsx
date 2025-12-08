export default function Vission() {
  return (
    <section className="relative bg-[#0a3d4f] text-white py-16 px-4">
      {/* Background Gradient Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Our Identity, Vision, and Values
          </h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-yellow-400 text-[#0a3d4f] p-8 rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold">10,000+</h3>
            <p className="text-lg">Happy Customers</p>
          </div>
          <div className="bg-yellow-400 text-[#0a3d4f] p-8 rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="text-lg">Professional Drivers</p>
          </div>
          <div className="bg-yellow-400 text-[#0a3d4f] p-8 rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold">1M+</h3>
            <p className="text-lg">Completed Rides</p>
          </div>
          <div className="bg-yellow-400 text-[#0a3d4f] p-8 rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold">98%</h3>
            <p className="text-lg">Customer Satisfaction</p>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Mission</h3>
            <p className="text-gray-700">
              Our mission is simple yet powerful: to make every journey seamless, safe, and unforgettable. We strive to deliver experiences that go beyond transportation — where comfort, punctuality, and attention to detail are standard on every ride.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Vision</h3>
            <p className="text-gray-700">
              At Chauffeurio, we stand for excellence, reliability, and a customer-first approach, delivering punctual, tailored rides with care. Our globally accessible service ensures easy booking, clear communication, and professional support for every traveler.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
