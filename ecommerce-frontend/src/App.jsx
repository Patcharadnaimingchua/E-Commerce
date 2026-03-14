import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3000";

// ─── Helpers ────────────────────────────────────────────────────────────────
const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const jsonHeader = () => ({ "Content-Type": "application/json" });

// ─── Global Styles ───────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --white: #ffffff;
      --gray-50: #f9f9f8;
      --gray-100: #f2f2f0;
      --gray-200: #e8e8e5;
      --gray-300: #d4d4cf;
      --gray-400: #a8a8a0;
      --gray-500: #737370;
      --gray-700: #3a3a37;
      --gray-900: #1a1a18;
      --accent: #1a1a18;
      --accent-soft: #f0f0ee;
      --red: #e5483a;
      --green: #2d9e6b;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --shadow-xs: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-sm: 0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05);
      --shadow-lg: 0 8px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06);
      --font-display: 'Instrument Serif', Georgia, serif;
      --font-body: 'DM Sans', -apple-system, sans-serif;
      --transition: 0.18s ease;
    }

    html { font-size: 16px; -webkit-font-smoothing: antialiased; }

    body {
      font-family: var(--font-body);
      background: var(--gray-50);
      color: var(--gray-900);
      min-height: 100vh;
    }

    /* Navbar */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--gray-200);
      height: 60px;
      display: flex; align-items: center;
    }
    .navbar-inner {
      max-width: 1180px; margin: 0 auto; padding: 0 28px;
      width: 100%; display: flex; align-items: center; gap: 0;
    }
    .navbar-brand {
      font-family: var(--font-display); font-size: 1.25rem;
      color: var(--gray-900); letter-spacing: -0.01em; cursor: pointer;
      text-decoration: none; user-select: none; margin-right: auto;
    }
    .navbar-brand em { font-style: italic; }
    .nav-links { display: flex; align-items: center; gap: 4px; }
    .nav-btn {
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
      color: var(--gray-500); background: none; border: none;
      padding: 7px 14px; border-radius: var(--radius-sm); cursor: pointer;
      transition: color var(--transition), background var(--transition);
      display: flex; align-items: center; gap: 6px;
    }
    .nav-btn:hover { color: var(--gray-900); background: var(--gray-100); }
    .nav-btn.active { color: var(--gray-900); background: var(--gray-100); }
    .nav-badge {
      background: var(--gray-900); color: var(--white);
      font-size: 0.7rem; font-weight: 600; min-width: 18px; height: 18px;
      border-radius: 99px; display: inline-flex; align-items: center;
      justify-content: center; padding: 0 5px;
    }
    .nav-divider { width: 1px; height: 20px; background: var(--gray-200); margin: 0 8px; }
    .nav-user { font-size: 0.8rem; color: var(--gray-500); padding: 0 8px; }

    /* Layout */
    .page { max-width: 1180px; margin: 0 auto; padding: 48px 28px 80px; }
    .page-sm { max-width: 480px; margin: 0 auto; padding: 64px 24px; }
    .page-md { max-width: 720px; margin: 0 auto; padding: 48px 28px 80px; }

    /* Page Header */
    .page-header { margin-bottom: 36px; }
    .page-title {
      font-family: var(--font-display); font-size: 2.2rem; font-weight: 400;
      color: var(--gray-900); letter-spacing: -0.02em; line-height: 1.15;
    }
    .page-subtitle { font-size: 0.95rem; color: var(--gray-500); margin-top: 6px; font-weight: 400; }

    /* Cards */
    .card {
      background: var(--white); border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm); border: 1px solid var(--gray-200);
      overflow: hidden; transition: box-shadow var(--transition), transform var(--transition);
    }
    .card:hover { box-shadow: var(--shadow-md); }
    .card-body { padding: 20px; }

    /* Product Grid */
    .products-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px;
    }
    .product-card { cursor: pointer; }
    .product-card:hover { transform: translateY(-2px); }
    .product-img-placeholder {
      width: 100%; aspect-ratio: 4/3; background: var(--gray-100);
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; color: var(--gray-300);
    }
    .product-name {
      font-size: 0.95rem; font-weight: 500; color: var(--gray-900);
      margin-bottom: 4px; line-height: 1.35;
    }
    .product-price {
      font-family: var(--font-display); font-size: 1.1rem;
      color: var(--gray-900); font-style: italic;
    }
    .product-desc { font-size: 0.82rem; color: var(--gray-500); margin-top: 4px; line-height: 1.5; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
      padding: 10px 20px; border-radius: var(--radius-sm); cursor: pointer;
      border: none; transition: all var(--transition); text-decoration: none;
      white-space: nowrap;
    }
    .btn-primary { background: var(--gray-900); color: var(--white); }
    .btn-primary:hover { background: var(--gray-700); }
    .btn-primary:disabled { background: var(--gray-300); cursor: not-allowed; }
    .btn-secondary { background: var(--white); color: var(--gray-700); border: 1px solid var(--gray-200); }
    .btn-secondary:hover { background: var(--gray-50); border-color: var(--gray-300); }
    .btn-ghost { background: none; color: var(--gray-500); padding: 8px 12px; }
    .btn-ghost:hover { background: var(--gray-100); color: var(--gray-900); }
    .btn-danger { background: #fef2f2; color: var(--red); border: 1px solid #fecaca; }
    .btn-danger:hover { background: #fee2e2; }
    .btn-sm { font-size: 0.8rem; padding: 7px 14px; }
    .btn-lg { font-size: 1rem; padding: 13px 28px; border-radius: var(--radius-md); }
    .btn-full { width: 100%; }

    /* Form */
    .form-group { margin-bottom: 18px; }
    .form-label {
      display: block; font-size: 0.82rem; font-weight: 500;
      color: var(--gray-700); margin-bottom: 7px; letter-spacing: 0.01em;
    }
    .form-input {
      width: 100%; padding: 10px 14px; font-family: var(--font-body);
      font-size: 0.9rem; color: var(--gray-900); background: var(--white);
      border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm);
      outline: none; transition: border-color var(--transition), box-shadow var(--transition);
    }
    .form-input:focus { border-color: var(--gray-900); box-shadow: 0 0 0 3px rgba(26,26,24,0.07); }
    .form-input::placeholder { color: var(--gray-400); }
    textarea.form-input { resize: vertical; min-height: 90px; }

    /* Auth */
    .auth-card { background: var(--white); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-md); border: 1px solid var(--gray-200); }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-title { font-family: var(--font-display); font-size: 1.9rem; color: var(--gray-900); margin-bottom: 6px; }
    .auth-subtitle { font-size: 0.875rem; color: var(--gray-500); }
    .auth-switch { text-align: center; font-size: 0.875rem; color: var(--gray-500); margin-top: 20px; }
    .auth-switch button { background: none; border: none; color: var(--gray-900); font-weight: 500; cursor: pointer; text-decoration: underline; font-size: inherit; font-family: inherit; }

    /* Alert */
    .alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.875rem; margin-bottom: 18px; }
    .alert-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .alert-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

    /* Product Detail */
    .product-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .product-detail-img {
      aspect-ratio: 1; background: var(--gray-100); border-radius: var(--radius-lg);
      display: flex; align-items: center; justify-content: center;
      font-size: 6rem; border: 1px solid var(--gray-200);
    }
    .product-detail-title { font-family: var(--font-display); font-size: 2rem; color: var(--gray-900); line-height: 1.2; margin-bottom: 10px; }
    .product-detail-price { font-family: var(--font-display); font-size: 1.6rem; color: var(--gray-900); font-style: italic; margin-bottom: 18px; }
    .product-detail-desc { font-size: 0.95rem; color: var(--gray-500); line-height: 1.7; margin-bottom: 28px; }

    /* Qty Selector */
    .qty-selector { display: flex; align-items: center; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm); width: fit-content; overflow: hidden; margin-bottom: 16px; }
    .qty-btn { background: none; border: none; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; color: var(--gray-700); display: flex; align-items: center; justify-content: center; transition: background var(--transition); }
    .qty-btn:hover { background: var(--gray-100); }
    .qty-value { font-size: 0.9rem; font-weight: 500; min-width: 36px; text-align: center; color: var(--gray-900); border-left: 1px solid var(--gray-200); border-right: 1px solid var(--gray-200); height: 36px; display: flex; align-items: center; justify-content: center; }

    /* Cart */
    .cart-item { display: flex; align-items: center; gap: 16px; padding: 18px; border-bottom: 1px solid var(--gray-100); }
    .cart-item:last-child { border-bottom: none; }
    .cart-item-img { width: 64px; height: 64px; background: var(--gray-100); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; }
    .cart-item-name { font-size: 0.9rem; font-weight: 500; color: var(--gray-900); }
    .cart-item-qty { font-size: 0.8rem; color: var(--gray-500); margin-top: 2px; }
    .cart-item-price { font-family: var(--font-display); font-size: 1rem; font-style: italic; color: var(--gray-900); margin-left: auto; margin-right: 16px; }
    .cart-summary { background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--gray-200); padding: 24px; }
    .cart-summary-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 10px; }
    .cart-summary-total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 600; color: var(--gray-900); padding-top: 14px; border-top: 1px solid var(--gray-200); margin-top: 6px; }
    .cart-grid { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }

    /* Orders */
    .order-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); margin-bottom: 16px; overflow: hidden; }
    .order-header { padding: 18px 22px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--gray-100); flex-wrap: wrap; }
    .order-id { font-size: 0.8rem; font-weight: 600; color: var(--gray-500); letter-spacing: 0.05em; text-transform: uppercase; }
    .order-total { font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--gray-900); margin-left: auto; }
    .order-date { font-size: 0.8rem; color: var(--gray-400); }
    .status-badge { font-size: 0.75rem; font-weight: 500; padding: 3px 10px; border-radius: 99px; }
    .status-pending { background: #fef9c3; color: #854d0e; }
    .status-completed { background: #dcfce7; color: #15803d; }
    .status-cancelled { background: #fee2e2; color: #b91c1c; }

    /* Reviews */
    .reviews-section { margin-top: 48px; }
    .reviews-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--gray-900); margin-bottom: 20px; }
    .review-item { padding: 18px 0; border-bottom: 1px solid var(--gray-100); }
    .review-author { font-size: 0.85rem; font-weight: 500; color: var(--gray-900); }
    .review-rating { color: #f59e0b; font-size: 0.85rem; margin: 3px 0; }
    .review-comment { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; margin-top: 4px; }
    .review-form { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 22px; margin-top: 20px; }

    /* Stars selector */
    .star-selector { display: flex; gap: 6px; margin-bottom: 14px; }
    .star-btn { background: none; border: none; font-size: 1.4rem; cursor: pointer; transition: transform var(--transition); padding: 0; line-height: 1; }
    .star-btn:hover { transform: scale(1.15); }

    /* Misc */
    .empty-state { text-align: center; padding: 72px 24px; }
    .empty-icon { font-size: 2.8rem; margin-bottom: 14px; opacity: 0.4; }
    .empty-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--gray-700); margin-bottom: 8px; }
    .empty-text { font-size: 0.9rem; color: var(--gray-500); }
    .divider { height: 1px; background: var(--gray-200); margin: 32px 0; }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--gray-500); background: none; border: none; cursor: pointer; margin-bottom: 28px; transition: color var(--transition); padding: 0; font-family: var(--font-body); }
    .back-btn:hover { color: var(--gray-900); }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: currentColor; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
    .spinner-dark { border-color: var(--gray-200); border-top-color: var(--gray-900); }
    .loading-state { display: flex; align-items: center; justify-content: center; padding: 72px; gap: 12px; color: var(--gray-400); font-size: 0.875rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Toast */
    .toast-container { position: fixed; bottom: 28px; right: 28px; z-index: 999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .toast { background: var(--gray-900); color: var(--white); padding: 12px 20px; border-radius: var(--radius-md); font-size: 0.875rem; box-shadow: var(--shadow-lg); animation: slideIn 0.25s ease; max-width: 320px; pointer-events: all; display: flex; align-items: center; gap: 8px; }
    .toast-success { background: #14532d; }
    .toast-error { background: #7f1d1d; }
    @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    @media (max-width: 768px) {
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
      .product-detail-grid { grid-template-columns: 1fr; gap: 28px; }
      .cart-grid { grid-template-columns: 1fr; }
      .page { padding: 28px 16px 60px; }
      .page-title { font-size: 1.7rem; }
      .navbar-inner { padding: 0 16px; }
    }
  `}</style>
);

// ─── Toast System ─────────────────────────────────────────────────────────────
let _toastId = 0;
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "default") => {
    const id = _toastId++;
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  return { toasts, show };
};

const Toast = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`toast toast-${t.type}`}>
        {t.type === "success" && "✓"}
        {t.type === "error" && "✕"}
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ value, onChange }) => (
  <div className="star-selector">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        type="button"
        key={n}
        className="star-btn"
        onClick={() => onChange && onChange(n)}
      >
        <span style={{ color: n <= value ? "#f59e0b" : "#d4d4cf" }}>★</span>
      </button>
    ))}
  </div>
);

// ─── Login Page ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin, setPage }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError("")

    try {

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (!data.token) {
        throw new Error("Invalid server response")
      }

      onLogin(data.token, data.user || { id: data.userId, email })

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="page-sm">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-title">Welcome back</div>
          <div className="auth-subtitle">
            Sign in to your account to continue
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Sign in"}
          </button>

        </form>

        <div className="auth-switch">
          Don&apos;t have an account?{" "}
          <button onClick={() => setPage("register")}>
            Create one
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Register Page ────────────────────────────────────────────────────────────
const RegisterPage = ({ onLogin, setPage }) => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // ถ้า backend return token → login อัตโนมัติ
      if (data.token) {

        const user =
          data.user ||
          {
            id: data.userId,
            name: form.name,
            email: form.email
          }

        onLogin(data.token, user)

      } else {

        // ถ้า backend ไม่ return token
        setPage("login")

      }

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }

  const fields = [
    { key: "name", label: "Full name", type: "text", placeholder: "Jane Smith" },
    { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••" }
  ]

  return (
    <div className="page-sm">

      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-title">Create account</div>
          <div className="auth-subtitle">
            Join us and start shopping today
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {fields.map(({ key, label, type, placeholder }) => (

            <div className="form-group" key={key}>

              <label className="form-label">{label}</label>

              <input
                className="form-input"
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                required
              />

            </div>

          ))}

          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Create account"}
          </button>

        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <button onClick={() => setPage("login")}>
            Sign in
          </button>
        </div>

      </div>

    </div>
  )
}

// ─── Products Page ────────────────────────────────────────────────────────────
const ProductsPage = ({ setPage, setSelectedProduct }) => {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // ─── Load Products + Categories ─────────────────────────────
  useEffect(() => {

    const loadData = async () => {

      try {

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/categories`)
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])

      } catch (err) {

        setError("Failed to load data")

      } finally {

        setLoading(false)

      }

    }

    loadData()

  }, [])


  // ─── Filter Products ─────────────────────────────
  const filtered = products.filter((p) => {

    const matchSearch =
      (p.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchCategory =
      !selectedCategory ||
      Number(p.categoryId) === Number(selectedCategory)

    return matchSearch && matchCategory

  })


  return (
    <div className="page">

      {/* Header */}

      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16
        }}
      >

        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            {filtered.length} items
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >

          {/* Category Filter */}

          <select
            className="form-input"
            style={{ width: 160 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >

            <option value="">All Categories</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

          </select>

          {/* Search */}

          <input
            className="form-input"
            style={{ width: 220 }}
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>


      {/* Loading */}

      {loading && (
        <div className="loading-state">
          <span className="spinner spinner-dark" />
          Loading products…
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <div className="empty-title">Failed to load products</div>
          <div className="empty-text">{error}</div>
        </div>
      )}


      {/* Empty */}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-title">No products found</div>
        </div>
      )}


      {/* Products Grid */}

      {!loading && !error && filtered.length > 0 && (

        <div className="products-grid">

          {filtered.map((p) => (

            <div
              key={p.id}
              className="card product-card"
              onClick={() => {
                setSelectedProduct(p)
                setPage("product")
              }}
            >

              <div className="product-img-placeholder">

                <img
                  src={p.imageUrl ? p.imageUrl.split(",")[0] : "https://via.placeholder.com/400x300?text=No+Image"}

                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image"
                  }}

                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />

              </div>


              {/* Product Info */}

              <div className="card-body">

                <div className="product-name">
                  {p.name}
                </div>

                <div className="product-price">
                  ${Number(p.price || 0).toFixed(2)}
                </div>

                {p.stock !== undefined && (
                  <div
                    style={{
                      fontSize: 12,
                      color: p.stock > 0 ? "#16a34a" : "#dc2626",
                      marginTop: 4
                    }}
                  >
                    {p.stock > 0
                      ? `In stock (${p.stock})`
                      : "Out of stock"}
                  </div>
                )}

                {p.description && (
                  <div className="product-desc">
                    {p.description.length > 80
                      ? p.description.slice(0, 80) + "…"
                      : p.description}
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}
// ─── Product Detail ────────────────────────────────────────────────────────────
const ProductDetailPage = ({ product, token, user, setPage, showToast }) => {

  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  })

  const [submittingReview, setSubmittingReview] = useState(false)

  // ─── LOAD REVIEWS ─────────────────────────────

  useEffect(() => {

    if (!product?.id) return

    const loadReviews = async () => {

      try {

        const res = await fetch(`${API}/reviews/${product.id}`)

        if (!res.ok) throw new Error()

        const data = await res.json()

        setReviews(Array.isArray(data) ? data : [])

      } catch {

        setReviews([])

      } finally {

        setReviewsLoading(false)

      }

    }

    loadReviews()

  }, [product])


  if (!product) return null


  // ADD TO CART
  const addToCart = async () => {

    if (!token) {
      showToast("Please sign in first", "error")
      setPage("login")
      return
    }

    setAdding(true)

    try {

      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: qty
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart")
      }

      showToast("Added to cart!", "success")

    } catch (err) {

      showToast(err.message, "error")

    } finally {

      setAdding(false)

    }

  }


  // ─── SUBMIT REVIEW ───────────────────────────

  const submitReview = async () => {

    if (!token) {
      showToast("Sign in to leave a review", "error")
      return
    }

    if (!reviewForm.comment.trim()) {
      showToast("Please write a comment", "error")
      return
    }

    setSubmittingReview(true)

    try {

      const res = await fetch(`${API}/reviews`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      })

      if (!res.ok) {
        throw new Error("Could not submit review")
      }

      const newReview = await res.json()

      setReviews(prev => [newReview, ...prev])

      setReviewForm({
        rating: 5,
        comment: ""
      })

      showToast("Review submitted!", "success")

    } catch (err) {

      showToast(err.message, "error")

    } finally {

      setSubmittingReview(false)

    }

  }


  return (
    <div className="page">

      <button
        className="back-btn"
        onClick={() => setPage("products")}
      >
        ← Back to products
      </button>

      <div className="product-detail-grid">

        <div className="product-detail-img">
          <img
            src={product.imageUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
          />
        </div>

        <div>

          <h1 className="product-detail-title">
            {product.name}
          </h1>

          <div className="product-detail-price">
            ${Number(product.price || 0).toFixed(2)}
          </div>

          {product.description && (
            <p className="product-detail-desc">
              {product.description}
            </p>
          )}

          <div className="qty-selector">

            <button
              className="qty-btn"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              −
            </button>

            <span className="qty-value">
              {qty}
            </span>

            <button
              className="qty-btn"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>

          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={addToCart}
            disabled={adding}
            style={{ marginTop: 8 }}
          >
            {adding ? (
              <>
                <span className="spinner" /> Adding…
              </>
            ) : (
              "Add to cart"
            )}
          </button>

        </div>

      </div>


      {/* REVIEWS */}

      <div className="reviews-section">

        <div className="divider" />

        <div className="reviews-title">
          Reviews ({reviews.length})
        </div>

        {reviewsLoading && (
          <p>Loading reviews…</p>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <p>No reviews yet</p>
        )}

        {reviews.map((r, i) => (

          <div
            key={r.id || i}
            className="review-item"
          >

            <div className="review-author">
              {r.user?.name || "Customer"}
            </div>

            <div className="review-rating">
              {"★".repeat(r.rating || 0)}
              {"☆".repeat(5 - (r.rating || 0))}
            </div>

            <div className="review-comment">
              {r.comment}
            </div>

          </div>

        ))}

        {token && (

          <div className="review-form">

            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: 12
              }}
            >
              Leave a review
            </div>

            <Stars
              value={reviewForm.rating}
              onChange={(r) =>
                setReviewForm({
                  ...reviewForm,
                  rating: r
                })
              }
            />

            <textarea
              className="form-input"
              placeholder="Share your experience…"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value
                })
              }
            />

            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 10 }}
              onClick={submitReview}
              disabled={submittingReview}
            >
              {submittingReview
                ? <span className="spinner" />
                : "Submit review"}
            </button>

          </div>

        )}

      </div>

    </div>
  )
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
const CartPage = ({ token, user, setPage, showToast }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const fetchCart = useCallback(() => {

    if (!token || !user?.id) return;

    setLoading(true);

    fetch(`${API}/cart/${user.id}`, {
      headers: authHeader(token)
    })
      .then((r) => r.json())
      .then((d) => {
        setCart(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        setCart([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [token, user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const removeItem = async (id) => {
    try {
      await fetch(`${API}/cart/${id}`, { method: "DELETE", headers: authHeader(token) });
      setCart((p) => p.filter((i) => i.id !== id));
      showToast("Item removed");
    } catch {
      showToast("Could not remove item", "error");
    }
  };

  const checkout = async () => {
    setCheckingOut(true);

    try {

      const total = cart.reduce(
        (s, i) => s + Number(i.product?.price || 0) * i.quantity,
        0
      );

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (!res.ok) throw new Error("Checkout failed");

      setOrdered(true);
      setCart([]);
      showToast("Order placed successfully!", "success");

    } catch (err) {

      showToast(err.message, "error");

    } finally {

      setCheckingOut(false);

    }
  };

  if (!token) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <div className="empty-title">Sign in to view your cart</div>
        <div className="empty-text" style={{ marginBottom: 24 }}>Your saved items are waiting.</div>
        <button className="btn btn-primary" onClick={() => setPage("login")}>Sign in</button>
      </div>
    </div>
  );

  if (ordered) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-icon" style={{ opacity: 1 }}>🎉</div>
        <div className="empty-title">Order placed!</div>
        <div className="empty-text" style={{ marginBottom: 24 }}>Thank you for your purchase.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={() => setPage("orders")}>View orders</button>
          <button className="btn btn-primary" onClick={() => setPage("products")}>Continue shopping</button>
        </div>
      </div>
    </div>
  );

  const total = cart.reduce((s, i) => s + Number(i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your cart</h1>
        <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="loading-state"><span className="spinner spinner-dark" /> Loading cart…</div>
      ) : cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-text" style={{ marginBottom: 24 }}>Find something you love.</div>
          <button className="btn btn-primary" onClick={() => setPage("products")}>Browse products</button>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="card" style={{ padding: 0 }}>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={item.product?.imageUrl}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80"
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="cart-item-name">{item.product?.name || "Product"}</div>
                  <div className="cart-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="cart-item-price">
                  ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div style={{ fontWeight: 500, marginBottom: 16, fontSize: "0.9rem", color: "var(--gray-900)" }}>
              Order summary
            </div>
            {cart.map((item) => (
              <div key={item.id} className="cart-summary-row">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-summary-total">
              <span>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.15rem" }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: 20 }}
              onClick={checkout}
              disabled={checkingOut}
            >
              {checkingOut ? <><span className="spinner" /> Processing…</> : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Orders Page ──────────────────────────────────────────────────────────────
const OrdersPage = ({ token, user, setPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API}/orders/${user.id}`, { headers: authHeader(token) })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token, user]);

  if (!token) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <div className="empty-title">Sign in to view your orders</div>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setPage("login")}>
          Sign in
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-md">
      <div className="page-header">
        <h1 className="page-title">Your orders</h1>
        <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      {loading ? (
        <div className="loading-state"><span className="spinner spinner-dark" /> Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No orders yet</div>
          <div className="empty-text" style={{ marginBottom: 24 }}>
            Start shopping to place your first order.
          </div>
          <button className="btn btn-primary" onClick={() => setPage("products")}>Browse products</button>
        </div>
      ) : (
        orders.map((order) => {
          const status = order.status || "pending";
          const statusClass =
            status === "completed" ? "status-completed"
              : status === "cancelled" ? "status-cancelled"
                : "status-pending";
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{String(order.id).slice(0, 8).toUpperCase()}</div>
                  <div className="order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "Recently placed"}
                  </div>
                </div>
                <span className={`status-badge ${statusClass}`}>{status}</span>
                <div className="order-total">
                  ${Number(order.totalPrice || 0).toFixed(2)}
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <div style={{ padding: "14px 22px" }}>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                        color: "var(--gray-500)",
                        padding: "4px 0"
                      }}
                    >
                      <span>Product × {item.quantity}</span>
                      <span>${(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, token, user, onLogout, cartCount }) => (
  <nav className="navbar">
    <div className="navbar-inner">
      <span className="navbar-brand" onClick={() => setPage("products")}>
        <em>shop</em>North
      </span>
      <div className="nav-links">
        <button className={`nav-btn${page === "products" ? " active" : ""}`} onClick={() => setPage("products")}>
          Products
        </button>
        {token && (
          <>
            <button className={`nav-btn${page === "cart" ? " active" : ""}`} onClick={() => setPage("cart")}>
              Cart {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </button>
            <button className={`nav-btn${page === "orders" ? " active" : ""}`} onClick={() => setPage("orders")}>
              Orders
            </button>
          </>
        )}
        <div className="nav-divider" />
        {token ? (
          <>
            {user?.role === "ADMIN" && (
              <button
                className={`nav-btn${page === "admin" ? " active" : ""}`}
                onClick={() => setPage("admin")}
              >
                Admin
              </button>
            )}

            <span className="nav-user">
              {user?.name || user?.email}
            </span>

            <button className="nav-btn" onClick={onLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-btn${page === "login" ? " active" : ""}`}
              onClick={() => setPage("login")}
            >
              Sign in
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setPage("register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  </nav>
);
function AdminPage({ token }) {

  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    imageUrl: "",
    categoryId: 1
  })

  // โหลดสินค้า
  const fetchProducts = () => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(setProducts)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ลบสินค้า
  const deleteProduct = async (id) => {

    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    })

    setProducts(products.filter(p => p.id !== id))
  }

  // กด edit
  const startEdit = (p) => {

    setEditingProduct(p)

    setForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      stock: p.stock || 0,
      imageUrl: p.imageUrl || "",
      categoryId: p.categoryId || 1
    })
  }

  // save edit
  const updateProduct = async () => {

    const res = await fetch(`${API}/products/${editingProduct.id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(form)
    })

    const data = await res.json()

    setProducts(products.map(p =>
      p.id === data.id ? data : p
    ))

    setEditingProduct(null)

    setForm({
      name: "",
      price: "",
      description: "",
      stock: 0,
      imageUrl: "",
      categoryId: 1
    })
  }

  // เพิ่มสินค้า
  const addProduct = async () => {

    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(form)
    })

    const data = await res.json()

    setProducts([...products, data])

    setForm({
      name: "",
      price: "",
      description: "",
      stock: 0,
      imageUrl: "",
      categoryId: 1
    })
  }

  return (
    <div className="page">

      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage your products</p>
      </div>

      {/* ADD / EDIT FORM */}

      <div className="card" style={{ marginBottom: 30 }}>

        <div className="card-body">

          <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

          <div className="form-group">
            <input
              className="form-input"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          {editingProduct ? (

            <button
              className="btn btn-primary"
              onClick={updateProduct}
            >
              Save Changes
            </button>

          ) : (

            <button
              className="btn btn-primary"
              onClick={addProduct}
            >
              Add Product
            </button>

          )}

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="products-grid">

        {products.map(p => (

          <div key={p.id} className="card">

            <div className="product-detail-img">
              <img
                src={p.imageUrl}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400"
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="card-body">

              <div className="product-name">{p.name}</div>

              <div className="product-price">${p.price}</div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}


// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {

  const [page, setPage] = useState("products")
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const { toasts, show: showToast } = useToast()

  // ─── LOGIN ─────────────────────────────────────────

  const handleLogin = (token, user) => {

    setToken(token)
    setUser(user)

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    setPage("products")

    showToast("Welcome back!", "success")
  }

  // ─── LOGOUT ────────────────────────────────────────

  const handleLogout = () => {

    setToken("")
    setUser(null)

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setCartCount(0)

    setPage("products")

    showToast("Signed out")
  }

  // ─── SYNC CART COUNT ───────────────────────────────

  useEffect(() => {

    if (!token || !user?.id) {
      setCartCount(0)
      return
    }

    fetch(`${API}/cart/${user.id}`, {
      headers: authHeader(token)
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCartCount(data.length)
        } else {
          setCartCount(0)
        }
      })
      .catch(() => setCartCount(0))

  }, [token, user, page])

  // ─── ROUTER ────────────────────────────────────────

  const renderPage = () => {

    switch (page) {

      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            setPage={setPage}
          />
        )

      case "register":
        return (
          <RegisterPage
            onLogin={handleLogin}
            setPage={setPage}
          />
        )

      case "product":
        return (
          <ProductDetailPage
            product={selectedProduct}
            token={token}
            user={user}
            setPage={setPage}
            showToast={showToast}
          />
        )

      case "cart":
        return (
          <CartPage
            token={token}
            user={user}
            setPage={setPage}
            showToast={showToast}
          />
        )

      case "orders":
        return (
          <OrdersPage
            token={token}
            user={user}
            setPage={setPage}
          />
        )
      case "admin":
        return (
          <AdminPage
            token={token}
          />
        )

      default:
        return (
          <ProductsPage
            setPage={setPage}
            setSelectedProduct={setSelectedProduct}
          />
        )
    }
  }

  // ─── APP ───────────────────────────────────────────

  return (
    <>
      <GlobalStyle />

      <Navbar
        page={page}
        setPage={setPage}
        token={token}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
      />

      <main>
        {renderPage()}
      </main>

      <Toast toasts={toasts} />
    </>
  )
}