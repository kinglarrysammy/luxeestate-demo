import { useState, useMemo } from 'react';
import { Search, MapPin, Bed, Bath, Maximize, X, Home, Filter, Globe } from 'lucide-react';
import { properties, formatPrice, Property } from './data';
import { translations, Lang } from './i18n';
import Chatbot from './Chatbot';
import './App.css';

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [minBeds, setMinBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selected, setSelected] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      const matchesBeds = p.beds >= minBeds;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesType && matchesBeds && matchesPrice;
    });
  }, [search, typeFilter, minBeds, maxPrice]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <Home size={28} />
            <span>LuxeEstate</span>
          </div>
          <nav className="nav">
            <a href="#listings">{t.listings}</a>
            <a href="#about">{t.about}</a>
            <a href="#contact">{t.contact}</a>
          </nav>
          <div className="header-actions">
            <div className="lang-switcher">
              <Globe size={16} />
              <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="Language">
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>
            </div>
            <button className="btn-primary">{t.listProperty}</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSubtitle}</p>
          <div className="search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} /> {t.filters}
            </button>
          </div>
          {showFilters && (
            <div className="filters">
              <div className="filter-group">
                <label>{t.propertyType}</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">{t.any}</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>
              <div className="filter-group">
                <label>{t.minBeds}</label>
                <select value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))}>
                  <option value={0}>{t.any}</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                </select>
              </div>
              <div className="filter-group">
                <label>{t.maxPrice}</label>
                <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}>
                  <option value={5000000}>{t.any}</option>
                  <option value={750000}>$750k</option>
                  <option value={1000000}>$1M</option>
                  <option value={1500000}>$1.5M</option>
                  <option value={2500000}>$2.5M</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="listings" id="listings">
        <div className="container">
          <div className="section-header">
            <h2>{t.featuredProperties}</h2>
            <p>{filtered.length} {t.propertiesAvailable}</p>
          </div>
          <div className="grid">
            {filtered.map((property) => (
              <article key={property.id} className="card" onClick={() => setSelected(property)}>
                <div className="card-image">
                  <img src={property.image} alt={property.title} loading="lazy" />
                  {property.featured && <span className="badge">{t.featured}</span>}
                  <span className="type-badge">{property.type}</span>
                </div>
                <div className="card-body">
                  <div className="price">{formatPrice(property.price)}</div>
                  <h3>{property.title}</h3>
                  <div className="location"><MapPin size={14} /> {property.location}</div>
                  <div className="specs">
                    <span><Bed size={16} /> {property.beds} {t.beds}</span>
                    <span><Bath size={16} /> {property.baths} {t.baths}</span>
                    <span><Maximize size={16} /> {property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="empty"><p>{t.noResults}</p></div>}
        </div>
      </section>

      <section className="about" id="about">
        <div className="container about-inner">
          <div>
            <h2>{t.whyChoose}</h2>
            <p>{t.aboutText}</p>
            <ul>
              <li>{t.benefit1}</li>
              <li>{t.benefit2}</li>
              <li>{t.benefit3}</li>
              <li>{t.benefit4}</li>
            </ul>
          </div>
          <div className="stats">
            <div className="stat"><strong>$2.4B+</strong><span>{t.propertiesSold}</span></div>
            <div className="stat"><strong>1,200+</strong><span>{t.happyClients}</span></div>
            <div className="stat"><strong>18</strong><span>{t.citiesCovered}</span></div>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container footer-inner">
          <div className="logo"><Home size={24} /><span>LuxeEstate</span></div>
          <p>© 2026 LuxeEstate. Premium Real Estate Demo.</p>
          <p className="muted">{t.footerNote}</p>
        </div>
      </footer>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X size={24} /></button>
            <img src={selected.image} alt={selected.title} className="modal-image" />
            <div className="modal-body">
              <div className="modal-price">{formatPrice(selected.price)}</div>
              <h2>{selected.title}</h2>
              <div className="location"><MapPin size={16} /> {selected.location}</div>
              <div className="specs large">
                <span><Bed size={18} /> {selected.beds} {t.bedrooms}</span>
                <span><Bath size={18} /> {selected.baths} {t.bathrooms}</span>
                <span><Maximize size={18} /> {selected.sqft.toLocaleString()} sqft</span>
              </div>
              <p className="description">{selected.description}</p>
              <button className="btn-primary full">{t.scheduleViewing}</button>
            </div>
          </div>
        </div>
      )}

      <Chatbot lang={lang} />
    </div>
  );
}

export default App;
