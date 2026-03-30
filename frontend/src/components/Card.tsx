"use client"
import Rating from "@mui/material/Rating"
export default function Card({ venueName, rating, image}: { venueName: string, rating?: number, image?: string}) {
  return (
    <div className="group bg-white rounded-xl shadow-md w-[280px] h-[420px] p-6 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <img 
      src={image || "/img/default.jpg"} 
      alt={venueName}
      className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <div 
        style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-serif italic mb-2 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500"
      >
        {venueName.charAt(0)}
      </div>

      <div className="space-y-2">
        <p className="text-[#D4AF37] font-serif font-bold text-lg leading-snug text-center h-[56px] flex items-center justify-center px-2">
          {venueName}
        </p>
        
        <div className="flex flex-col items-center">
          <Rating 
            value={rating} 
            readOnly 
            size="small"
            precision={0.1}
            sx={{ color: '#D4AF37' }} 
          />

          <p className="text-[#D4AF37] text-sm font-serif mt-1">
            {rating ? `${rating.toFixed(1)} / 5.0` : "N/A"}
          </p>
        </div>
      </div>

      <div 
        style={{ backgroundColor: '#D4AF37' }}
        className="mt-4 w-12 h-[2px] opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500"
      />

      <p style={{ color: '#D4AF37' }} className="text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
        View Sanctuary
      </p>
    </div>
  )
}