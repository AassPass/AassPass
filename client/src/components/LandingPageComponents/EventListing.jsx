import Image from "next/image";

export default function EventListing() {
    return (
        <section className="w-full bg-[#0b161c] px-4 flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto">
                <div className="relative w-full h-[300px] md:h-[480px] lg:h-[400px] rounded-2xl overflow-hidden">
                    <Image
                        src="/Registration Process White.jpg"
                        alt="Promote your event with AassPass"
                        fill
                        priority
                        className="object-contain" // ❌ no need for rounded here
                    />
                </div>
            </div>
        </section>
    );
}
