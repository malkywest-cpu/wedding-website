// RSVP Component
function RSVP() {
    const [status, setStatus] = React.useState('idle');
    const [numGuests, setNumGuests] = React.useState(1);
    const [guests, setGuests] = React.useState([{ name: '', attending: 'yes', dietary: '' }]);
    const [hasPlusOne, setHasPlusOne] = React.useState('no');
    const [plusOne, setPlusOne] = React.useState({ name: '', attending: 'yes', dietary: '' });
    const [songRequest, setSongRequest] = React.useState('');

    const handleNumGuestsChange = (e) => {
        const count = parseInt(e.target.value, 10) || 1;
        setNumGuests(count);
        setGuests(prev => {
            const newGuests = [...prev];
            while (newGuests.length < count) {
                newGuests.push({ name: '', attending: 'yes', dietary: '' });
            }
            return newGuests.slice(0, count);
        });
    };

    const updateGuest = (index, field, value) => {
        const newGuests = [...guests];
        newGuests[index][field] = value;
        setGuests(newGuests);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const allNames = guests.map((g, i) => `${g.name || `Guest ${i+1}`} (${g.attending})`);
            if (hasPlusOne === 'yes') {
                allNames.push(`Plus One: ${plusOne.name || 'Unnamed'} (${plusOne.attending})`);
            }
            const nameStr = allNames.join(', ');

            const anyAttending = guests.some(g => g.attending === 'yes') || (hasPlusOne === 'yes' && plusOne.attending === 'yes');
            const attendingStr = anyAttending ? 'yes' : 'no';

            const dietaryList = guests
                .filter(g => g.dietary && g.dietary.trim() !== '')
                .map((g, i) => `${g.name || `Guest ${i+1}`}: ${g.dietary}`);
            if (hasPlusOne === 'yes' && plusOne.dietary && plusOne.dietary.trim() !== '') {
                dietaryList.push(`Plus One (${plusOne.name || 'Unnamed'}): ${plusOne.dietary}`);
            }
            const dietaryStr = dietaryList.length > 0 ? dietaryList.join(' | ') : 'None';

            const data = {
                Name: nameStr,
                Attending: attendingStr,
                DietaryRequirements: dietaryStr,
                SongRequest: songRequest
            };

            console.log('RSVP Data:', data);
            // To integrate with backend: await fetch('/api/rsvp', { method: 'POST', body: JSON.stringify(data) })
            
            setStatus('success');
        } catch (error) {
            console.error('RSVP submission error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--blush-pink)] mb-6">
                    <div className="text-4xl text-white">✓</div>
                </div>
                <h2 className="text-3xl font-serif text-[var(--silver-dark)] mb-4">Thank You!</h2>
                <p className="text-lg text-gray-600">Your RSVP has been received. We can't wait to celebrate with you!</p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-[var(--silver-dark)] hover:text-gray-800 underline transition-colors"
                >
                    Submit another response
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 animate-fade-in" id="rsvp">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-serif text-[var(--silver-dark)] mb-4">RSVP</h2>
                <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-6"></div>
                <p className="text-lg text-gray-600">
                    Kindly respond by Monday 22nd June, 2026.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-[var(--silver)]">
                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-center">
                        Sorry, there was an error submitting your RSVP. Please try again.
                    </div>
                )}
                
                <div className="space-y-8">
                    <div className="border-b border-gray-100 pb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Number of Guests in your Party</label>
                        <select 
                            value={numGuests} 
                            onChange={handleNumGuestsChange}
                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blush-pink)] focus:border-transparent transition-all"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-6">
                        {guests.map((guest, index) => (
                            <div key={index} className="bg-gray-50 p-5 rounded-md border border-gray-200">
                                <h3 className="font-serif font-semibold text-lg text-[var(--silver-dark)] mb-4">Guest {index + 1}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={guest.name}
                                            onChange={(e) => updateGuest(index, 'name', e.target.value)}
                                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blush-pink)] transition-all"
                                            placeholder="e.g. John Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Attending?</label>
                                        <div className="flex space-x-6">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" checked={guest.attending === 'yes'} onChange={() => updateGuest(index, 'attending', 'yes')} className="text-[var(--blush-pink)] focus:ring-[var(--blush-pink)]" />
                                                <span>Joyfully Accept</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" checked={guest.attending === 'no'} onChange={() => updateGuest(index, 'attending', 'no')} className="text-[var(--silver-dark)] focus:ring-[var(--silver-dark)]" />
                                                <span>Regretfully Decline</span>
                                            </label>
                                        </div>
                                    </div>
                                    {guest.attending === 'yes' && (
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Dietary Requirements</label>
                                            <input 
                                                type="text" 
                                                value={guest.dietary}
                                                onChange={(e) => updateGuest(index, 'dietary', e.target.value)}
                                                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blush-pink)] transition-all"
                                                placeholder="Vegetarian, allergies, or 'None'"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <label className="block text-gray-700 font-semibold mb-2">Have you been allocated a plus one?</label>
                        <div className="flex space-x-6 mb-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" checked={hasPlusOne === 'yes'} onChange={() => setHasPlusOne('yes')} className="text-[var(--blush-pink)] focus:ring-[var(--blush-pink)]" />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" checked={hasPlusOne === 'no'} onChange={() => setHasPlusOne('no')} className="text-[var(--silver-dark)] focus:ring-[var(--silver-dark)]" />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <label className="block text-gray-700 font-semibold mb-2">Song Request</label>
                        <p className="text-sm text-gray-500 mb-2">One song request per party to get everyone on the dance floor!</p>
                        <input 
                            type="text" 
                            value={songRequest}
                            onChange={(e) => setSongRequest(e.target.value)}
                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blush-pink)] focus:border-transparent transition-all"
                            placeholder="What gets you on the dance floor?"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={status === 'submitting'}
                        className="w-full btn-primary flex justify-center items-center mt-4"
                    >
                        {status === 'submitting' ? (
                            <span className="flex items-center">
                                ⏳ Sending...
                            </span>
                        ) : 'Send RSVP'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Venue Details Component
function VenueDetails() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in" id="venue">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif text-[var(--silver-dark)] mb-4">The Venue</h2>
                <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We are thrilled to celebrate our special day with you at the beautiful Dalmeny Park House Hotel in Barrhead, Scotland.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 bg-[var(--blush-pink)] p-3 rounded-full flex-shrink-0 text-white">
                            <div className="text-xl">📍</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Location</h3>
                            <p className="text-gray-600">Dalmeny Park House Hotel<br/>Lochlibo Road<br/>Barrhead, Glasgow<br/>G78 1LG, Scotland</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 bg-[var(--silver)] p-3 rounded-full flex-shrink-0 text-white">
                            <div className="text-xl">🕐</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Schedule</h3>
                            <p className="text-gray-600">Arrival: 1:00 PM<br/>Ceremony: 1:30 PM<br/>Reception: 6:00 PM<br/>Carriages: Midnight</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 bg-[var(--blush-pink)] p-3 rounded-full flex-shrink-0 text-white">
                            <div className="text-xl">🚗</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Parking</h3>
                            <p className="text-gray-600">Complimentary parking is available on-site for all our guests.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 h-80 rounded-lg overflow-hidden shadow-lg border-4 border-[var(--silver)] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-60"></div>
                    <div className="relative z-10 bg-white/90 p-6 rounded-md text-center shadow-md">
                        <div className="text-3xl mb-2">🗺️</div>
                        <p className="font-serif font-semibold text-lg">Dalmeny Park House</p>
                        <a href="https://maps.google.com/?q=Dalmeny+Park+House+Hotel+Barrhead" target="_blank" rel="noopener noreferrer" className="text-[var(--blush-dark)] hover:underline text-sm mt-2 inline-block">Get Directions →</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Meet The Team Component
function MeetTheTeam() {
    const team = [
        { role: "Best Man", name: "Dylan West" },
        { role: "Bridesmaid", name: "Morven Ritchie" },
        { role: "Bridesmaid", name: "Abbie McDonald" },
        { role: "Bridesmaid", name: "Coco Gairns" },
        { role: "Mother of the Bride", name: "Christine Ritchie" },
        { role: "Mother of the Groom", name: "Linda West" },
        { role: "Father of the Groom", name: "Malcolm West Snr" },
        { role: "Pageboy", name: "Alfie Philip" }
    ];

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in" id="team">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif text-[var(--silver-dark)] mb-4">Wedding Party</h2>
                <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Meet the wonderful people who will be standing by our side on our special day.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                {team.map((member, idx) => (
                    <div key={idx} className="text-center group w-full sm:w-56 lg:w-64">
                        <div className="mb-4 relative overflow-hidden rounded-full w-48 h-48 mx-auto border-4 border-white shadow-lg bg-gradient-to-br from-[var(--blush-pink)] to-[var(--silver)] group-hover:border-[var(--blush-pink)] transition-colors duration-300 flex items-center justify-center text-5xl">
                            {['👨', '👩', '👧', '🧒'][idx % 4]}
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-[var(--blush-dark)] font-medium mt-1 uppercase tracking-wider text-sm">{member.role}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 bg-white p-8 rounded-lg shadow-sm border border-[var(--silver)] text-center max-w-2xl mx-auto">
                <div className="text-3xl text-[var(--blush-pink)] mb-4 mx-auto">💕</div>
                <h3 className="text-2xl font-serif text-[var(--silver-dark)] mb-3">To Our Family & Friends</h3>
                <p className="text-gray-600">
                    Thank you to everyone who has supported us throughout our journey. We wouldn't be where we are without your love, guidance, and friendship. We can't wait to share this beautiful milestone with all of you.
                </p>
            </div>
        </div>
    );
}

// Accommodation Component
function Accommodation() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in" id="accommodation">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif text-[var(--silver-dark)] mb-4">Accommodation</h2>
                <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We'd love for you to stay and celebrate with us into the night!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-8 shadow-sm border-t-4 border-[var(--blush-pink)] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-serif font-semibold text-gray-800">Dalmeny Park House</h3>
                        <div className="text-3xl">🛏️</div>
                    </div>
                    <p className="text-gray-600 mb-6 flex-grow">
                        We have reserved a block of rooms at the venue for our guests. Please mention the <strong>West-Elliott Wedding</strong> when booking to receive a discounted rate. Rooms are allocated on a first-come, first-served basis.
                    </p>
                    <div className="space-y-3 mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center text-gray-600">
                            <div className="mr-3">📞</div>
                            <span>+44 141 881 9211</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <div className="mr-3">🌐</div>
                            <a href="https://dalmenypark.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--blush-dark)] transition-colors">dalmenypark.com</a>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm border-t-4 border-[var(--silver)] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-serif font-semibold text-gray-800">Nearby Alternatives</h3>
                        <div className="text-3xl">🏢</div>
                    </div>
                    <p className="text-gray-600 mb-6 flex-grow">
                        If the venue is fully booked, there are several lovely hotels and B&Bs in the surrounding Barrhead and greater Glasgow area, just a short taxi ride away.
                    </p>
                    <ul className="space-y-3 mt-auto pt-6 border-t border-gray-100 text-gray-600">
                        <li className="flex items-start">
                            <div className="text-[var(--silver)] mt-1 mr-3 flex-shrink-0">✓</div>
                            <span><strong>Premier Inn Glasgow</strong> (15 mins away)</span>
                        </li>
                        <li className="flex items-start">
                            <div className="text-[var(--silver)] mt-1 mr-3 flex-shrink-0">✓</div>
                            <span><strong>Village Hotel Glasgow</strong> (20 mins away)</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-12 bg-[var(--blush-pink)] bg-opacity-20 rounded-lg p-6 text-center">
                <div className="text-2xl text-[var(--text-main)] mx-auto mb-3">ℹ️</div>
                <p className="text-gray-800">
                    Need a taxi at the end of the night? We recommend booking in advance. <br/> <strong>Barrhead Taxis:</strong> 0141 881 1111
                </p>
            </div>
        </div>
    );
}

// FAQs Component
function FAQs() {
    const faqs = [
        {
            q: "What is the dress code?",
            a: "We request formal wedding attire. We'd love to see you dressed up for our special day! The more kilts the merrier."
        },
        {
            q: "Can I bring a plus one?",
            a: "Unfortunately due to limited capacity we are only able to accommodate the guests listed in the invitation."
        },
        {
            q: "When should I RSVP by?",
            a: "Please let us know your plans by Monday 22nd June, 2026 using the RSVP form on this website."
        }
    ];

    return (
        <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in" id="faqs">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif text-[var(--silver-dark)] mb-4">FAQs</h2>
                <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-6"></div>
                <p className="text-lg text-gray-600">Everything you need to know about our big day.</p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[var(--silver)]">
                        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2 flex items-start">
                            <div className="text-[var(--blush-dark)] mr-3 mt-1 flex-shrink-0">❓</div>
                            {faq.q}
                        </h3>
                        <p className="text-gray-600 ml-9">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center text-gray-600">
                <p>Have another question? Feel free to reach out to us directly!</p>
            </div>
        </div>
    );
}

// Main App Component
function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
                <div className="font-serif text-2xl font-semibold text-[var(--silver-dark)]">
                    💕 West & Elliott
                </div>
                <div className="hidden md:flex space-x-8">
                    <a href="#hero" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors">Home</a>
                    <a href="#venue" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors">Venue</a>
                    <a href="#team" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors">Party</a>
                    <a href="#accommodation" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors">Stay</a>
                    <a href="#faqs" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors">FAQs</a>
                    <a href="#rsvp" className="text-gray-600 hover:text-[var(--blush-pink)] transition-colors font-semibold">RSVP</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="hero-section py-24 md:py-32">
                <div className="max-w-4xl mx-auto text-center px-6 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--silver-dark)] mb-4">
                        Malcolm & Catherine
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-4">Together with joy!</p>
                    <div className="w-24 h-1 bg-[var(--blush-pink)] mx-auto mb-8"></div>
                    <p className="text-lg text-gray-600 mb-8">
                        22nd June, 2026<br/>
                        Dalmeny Park House, Barrhead, Scotland
                    </p>
                    <a href="#rsvp" className="btn-primary inline-block">
                        RSVP Now
                    </a>
                </div>
            </section>

            {/* Venue Details */}
            <section>
                <VenueDetails />
            </section>

            {/* Meet The Team */}
            <section>
                <MeetTheTeam />
            </section>

            {/* Accommodation */}
            <section>
                <Accommodation />
            </section>

            {/* FAQs */}
            <section>
                <FAQs />
            </section>

            {/* RSVP */}
            <section className="bg-white">
                <RSVP />
            </section>

            {/* Footer */}
            <footer className="bg-[var(--silver-dark)] text-white py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="mb-2 font-serif text-xl">Malcolm & Catherine</p>
                    <p className="text-gray-300 mb-4">22nd June, 2026</p>
                    <p className="text-sm text-gray-400">
                        Thank you for being part of our special day! 💕
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
          
