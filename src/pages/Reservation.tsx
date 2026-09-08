import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createReservation } from '../lib/api';
import foodImages from '../lib/images';
import { fadeInUp, fadeInDown, staggerChildren, scaleIn } from '../lib/gsapUtils';

gsap.registerPlugin(ScrollTrigger);

const timeSlots = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM'
];

export default function Reservation() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preselectedItem = searchParams.get('name');
  const preselectedId = searchParams.get('item');
  const preselectedPrice = searchParams.get('price');

  const [form, setForm] = useState({
    date: '', time: '', guests: '', name: '', phone: '', email: '', specialRequest: '',
    reservationType: 'dine-in',
    selectedItem: preselectedItem || '',
    selectedItemId: preselectedId || '',
    deliveryAddress: '', deliveryPhone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeInDown('.reservation-badge', { delay: 0.2 });
      fadeInUp('.reservation-title', { delay: 0.3, duration: 0.8 });
      staggerChildren('.form-section > *', { stagger: 0.1, delay: 0.4 });
      scaleIn('.hero-image-sticky', { delay: 0.5, duration: 0.8 });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (preselectedItem) {
      setShowDeliveryForm(false);
    }
  }, [preselectedItem]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setShowTimePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (type: string) => {
    setForm({ ...form, reservationType: type });
    setShowDeliveryForm(type === 'delivery');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.guests || !form.name || !form.phone) {
      setMessage('Please fill in all required fields: date, time, guests, name, and phone.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      const res = await createReservation({
        ...form,
        guests: form.guests === '6+' ? 6 : form.guests
      });
      setMessage(res.data.message);
      setStatus('success');
      setForm({
        date: '', time: '', guests: '', name: '', phone: '', email: '', specialRequest: '',
        reservationType: 'dine-in', selectedItem: '', selectedItemId: '',
        deliveryAddress: '', deliveryPhone: ''
      });
      setShowDeliveryForm(false);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setMessage(message);
      setStatus('error');
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const selectDate = (day: number) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const date = new Date(year, month, day);
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setForm({ ...form, date: formatted });
    setShowDatePicker(false);
  };

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (day: number) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const date = new Date(year, month, day);
    return date < today;
  };

  const selectedDateObj = form.date ? new Date(form.date + 'T00:00:00') : null;

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
         <div ref={heroImageRef} className="hero-image-sticky hidden lg:block lg:sticky lg:top-28 rounded-2xl overflow-hidden border border-gold/20 animate-float">
          <img src={foodImages.restaurant} alt="Maestro Cafe interior" className="w-full aspect-[4/5] object-cover" />
          <div className="bg-surface px-6 py-5">
            <p className="font-serif text-2xl text-champagne">An evening worth remembering.</p>
            <p className="text-muted text-sm mt-2">Liberty Plaza, Sialkot Road, Gujranwala</p>
          </div>
        </div>

        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-12">
             <p className="reservation-badge text-gold tracking-[0.3em] text-xs uppercase mb-3">Reservations</p>
             <h1 className="reservation-title font-serif text-4xl sm:text-5xl">YOUR TABLE AWAITS.</h1>
          </div>

          {preselectedItem && (
             <div className="glass rounded-2xl p-6 mb-6 border-gold/30 selected-item-wrapper">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div>
                  <p className="text-gold text-sm">Selected from Menu</p>
                  <p className="font-serif text-xl text-champagne">{preselectedItem}</p>
                  <p className="text-gold">PKR {parseInt(preselectedPrice || '0').toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 md:p-10 space-y-6">
            <div className="form-section space-y-6">
            <div>
              <label className="block text-sm text-muted mb-3">Reservation Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('dine-in')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    form.reservationType === 'dine-in'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-white/10 text-muted hover:border-gold/30'
                  }`}
                >
                  <span className="text-2xl block mb-2">🍽️</span>
                  <span className="text-sm font-medium">Dine-in</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('delivery')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    form.reservationType === 'delivery'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-white/10 text-muted hover:border-gold/30'
                  }`}
                >
                  <span className="text-2xl block mb-2">🚚</span>
                  <span className="text-sm font-medium">Delivery</span>
                </button>
              </div>
            </div>

            {showDeliveryForm && (
              <div className="space-y-4 animate-slide-down">
                <div>
                  <label className="block text-sm text-muted mb-2">Delivery Address</label>
                  <input type="text" required value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
                    placeholder="Enter your full delivery address"
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Contact Phone for Delivery</label>
                  <input type="tel" required value={form.deliveryPhone} onChange={e => setForm({ ...form, deliveryPhone: e.target.value })}
                    placeholder="+92 ..."
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              {/* Date Picker */}
              <div className="relative" ref={dateRef}>
                <label className="block text-sm text-muted mb-2">Date</label>
                <button
                  type="button"
                  onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none flex items-center justify-between"
                >
                  <span className={form.date ? '' : 'text-muted'}>
                    {form.date ? formatDate(selectedDateObj!) : 'Select date'}
                  </span>
                  <span className="text-gold text-xl">📅</span>
                </button>
                
                {showDatePicker && (
                  <div className="relative mt-2 z-10 glass-strong rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                      <button type="button" onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <span className="text-champagne">◀</span>
                      </button>
                      <span className="font-serif text-base sm:text-lg text-champagne">
                        {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                      </span>
                      <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <span className="text-champagne">▶</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-center text-xs text-muted py-2">{d}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: getFirstDayOfMonth(calendarDate.getFullYear(), calendarDate.getMonth()) }, (_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: getDaysInMonth(calendarDate.getFullYear(), calendarDate.getMonth()) }, (_, i) => {
                        const day = i + 1;
                        const isDisabled = isDateDisabled(day);
                        const isSelected = form.date === `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => !isDisabled && selectDate(day)}
                            disabled={isDisabled}
                            className={`aspect-square rounded-lg text-xs sm:text-sm transition-all ${
                              isDisabled 
                                ? 'text-muted/30 cursor-not-allowed' 
                                : isSelected 
                                  ? 'bg-gold text-black font-medium' 
                                  : 'hover:bg-white/10 text-champagne'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Picker */}
              <div className="relative" ref={timeRef}>
                <label className="block text-sm text-muted mb-2">Time</label>
                <button
                  type="button"
                  onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none flex items-center justify-between"
                >
                  <span className={form.time ? '' : 'text-muted'}>
                    {form.time || 'Select time'}
                  </span>
                  <span className="text-gold text-xl">🕐</span>
                </button>

                {showTimePicker && (
                  <div className="relative mt-2 z-10 glass-strong rounded-2xl p-4 w-full max-w-sm shadow-2xl animate-scale-in max-h-64 sm:max-h-80 overflow-y-auto">
                    <div className="text-center mb-3">
                      <div className="inline-block w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-gold flex items-center justify-center">
                        <span className="text-gold text-xl sm:text-2xl">⏰</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setForm({ ...form, time: t }); setShowTimePicker(false); }}
                          className={`py-2 px-1 sm:px-3 rounded-lg text-xs sm:text-sm transition-all ${
                            form.time === t
                              ? 'bg-gold text-black font-medium'
                              : 'bg-white/5 text-champagne hover:bg-white/10'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-muted text-center mb-2">Quick Select</p>
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => { setForm({ ...form, time: '7:00 PM' }); setShowTimePicker(false); }}
                          className="text-xs text-gold hover:text-champagne transition-colors"
                        >
                          Early: 7 PM
                        </button>
                        <span className="text-muted">|</span>
                        <button
                          type="button"
                          onClick={() => { setForm({ ...form, time: '9:00 PM' }); setShowTimePicker(false); }}
                          className="text-xs text-gold hover:text-champagne transition-colors"
                        >
                          Peak: 9 PM
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Guests</label>
              <select required value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}
                className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none">
                <option value="">Number of guests</option>
                {[1, 2, 3, 4, 5, '6+'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-muted mb-2">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Phone</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92 ..." className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com" className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Special Request</label>
              <textarea rows={3} value={form.specialRequest} onChange={e => setForm({ ...form, specialRequest: e.target.value })}
                placeholder="Any special requests or notes..."
                className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
            </div>

            {status === 'success' && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 animate-bounce-in">
                <p className="text-green-400 text-sm text-center">{message}</p>
                <Link to="/menu" className="block text-center mt-3 text-gold hover:text-champagne transition-colors">
                  Continue browsing menu →
                </Link>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm text-center">{message}</p>
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} 
              className="w-full btn-gold py-4 rounded-full text-sm tracking-widest disabled:opacity-60 hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300">
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></span>
                  Sending...
                </span>
              ) : form.reservationType === 'delivery' ? 'PLACE DELIVERY ORDER' : 'CONFIRM RESERVATION'}
            </button>

            <p className="text-muted text-xs text-center">
              {form.reservationType === 'delivery' 
                ? 'For delivery, please ensure your address is within our delivery area.'
                : 'For dine-in, arrive 10 minutes before your reservation time.'}
            </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
