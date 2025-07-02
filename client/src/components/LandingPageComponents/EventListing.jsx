import Image from "next/image";

export default function EventListing() {
  return (
    <section className="w-full bg-[#0b161c] px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="w-full flex justify-center">
          <Image
            src="/Registration Process White.jpg"
            alt="Promote your event with AassPass"
            width={1200} // you can adjust these values
            height={600}
            priority
            className="w-full h-auto rounded-md md:rounded-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
