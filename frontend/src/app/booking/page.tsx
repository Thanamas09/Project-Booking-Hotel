import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
    return (
        <main 
            style={{ backgroundColor: '#F9F6EE' }} 
            className="min-h-screen flex flex-col items-center justify-start py-32 px-6"
        >
            <div className="text-center mb-20 flex flex-col gap-6">
                <div className="space-y-3">
                    <h1 
                        style={{ color: '#D4AF37' }} 
                        className="text-6xl font-serif font-bold italic tracking-tight"
                    >
                        Reserve Your Miracle
                    </h1>
                    <div 
                        style={{ backgroundColor: '#D4AF37' }} 
                        className="w-24 h-[1px] mx-auto opacity-40"
                    ></div>
                </div>
                
                <p className="text-gray-400 uppercase tracking-[0.4em] text-[10px] font-medium mx-auto leading-relaxed text-center">
                    Exquisite Spaces for Extraordinary Moments <br/>
                    Professional Service for Your Special Day
                </p>
            </div>

            <div className="w-full flex justify-center py-10">
                <div className="transition-all duration-700 hover:scale-[1.01]">
                    <BookingForm />
                </div>
            </div>
            
            <div className="mt-24 text-center space-y-4">
                <div 
                    style={{ backgroundColor: '#D4AF37' }} 
                    className="w-[1px] h-12 mx-auto opacity-20"
                ></div>
                <p className="text-gray-400 text-xs font-light italic tracking-wider">
                    Need assistance? Our concierge is available 24/7. <br/>
                    <span style={{ color: '#D4AF37' }} className="not-italic font-bold mt-2 inline-block">
                        Call +66 85 373 8575
                    </span>
                </p>
            </div>
        </main>
    );
}