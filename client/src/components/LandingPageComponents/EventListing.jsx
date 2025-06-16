export default function EventListing() {
    const steps = [
        {
            number: '01',
            title: 'Register',
            description: 'Sign up as an organiser in minutes',
        },
        {
            number: '02',
            title: 'List your event',
            description: 'Add event details, images & ticketing information',
        },
        {
            number: '03',
            title: 'Event is live',
            description: 'Your event is now live on District',
        },
    ];

    return (
        <section className="w-full text-white bg-gradient-to-r from-[#0b161c] to-[#201446] p-4 md:px-16">
            <div className="max-w-7xl mx-auto px-4 py-14 space-y-20">
                {/* How to list your events */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 bg-gradient-to-r from-[#6aabf2] to-[#8989de] bg-clip-text text-transparent">
                        How to list your events
                    </h2>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#2c3b44] to-[#3b2f5d]  p-8 md:p-16 rounded-[2rem]"
                        style={{ boxShadow: " 0px -3px 5px 0px #766565" }}>
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-4 relative">
                                {/* Step Card */}
                                <div className="flex flex-col items-center text-center gap-2 w-60">
                                    <div className="text-5xl font-bold">{step.number}</div>
                                    <div className="text-xl font-semibold">{step.title}</div>
                                    <p className="text-sm text-white/80">{step.description}</p>
                                </div>

                                {/* Arrows (if not last step) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex gap-2">
                                        <div className="hidden md:block absolute right-[-40px] top-[40%] transform -translate-y-1/2 right-arrow" />
                                        <div className="hidden md:block absolute right-[-20px] top-[40%] transform -translate-y-1/2 right-arrow" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Event Insights Section */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Stats Cards */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md text-black">
                            <h4 className="text-sm text-gray-500 mb-1">Ticket sold</h4>
                            <p className="text-3xl font-bold text-green-600">301</p>
                            <p className="text-xs text-gray-400">November 1–20</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-black relative left-6 top-6">
                            <h4 className="text-sm text-gray-500 mb-1">Total revenue</h4>
                            <p className="text-3xl font-bold text-green-600">₹9,000</p>
                            <p className="text-xs text-gray-400">November 1–20</p>
                        </div>
                    </div>

                    {/* Insights Text */}
                    <div className="flex-1 space-y-12">
                        <div>
                            <h4 className="text-4xl font-semibold">Grow eventfully</h4>
                            <p className="mt-2 text-white/80">
                                Gain deep insights into how your event is performing with real-time analytics
                            </p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-semibold">Traffic insights</h4>
                            <p className="mt-2 text-white/80">
                                Track the number of views, tickets sold and interest in your event.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-semibold">Marketing impact</h4>
                            <p className="mt-2 text-white/80">
                                Understand which promotions or campaigns are driving the most traffic and conversions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
