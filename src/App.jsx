// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Home,
  Info,
  Briefcase,
  Phone,
  Bell,
  Settings,
  BarChart2,
  Car,
  FileCheck,
  Users,
  ArrowLeft,
  MoreHorizontal,
  LogIn,
  UserPlus,
  Save,
  Camera,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { httpService, API_ENDPOINTS } from './services/api.config';

/* =====================
   Config colores y util
   ===================== */
const COLORS = {
  intrantBlue: "#003D73",
  intrantOrange: "#FF6A13",
  intrantGreen: "#009639",
  white: "#FFFFFF",
  grayBg: "#F5F5F5",
  pie: ["#009639", "#FF6A13"],
};

const nowDate = () => new Date().toISOString().slice(0, 10);

/* =====================
   Plantillas de inspección por tipo de vehículo
   ===================== */
const INSPECTION_TEMPLATES = {
  AUTO: [
    { code: "SEG_001", name: "Sistema de frenos", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar estado de discos, pastillas y sistema hidráulico" },
    { code: "SEG_002", name: "Sistema de dirección", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar columna, caja de dirección y terminales" },
    { code: "SEG_003", name: "Sistema de suspensión", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar amortiguadores, resortes y bujes" },
    { code: "SEG_004", name: "Neumáticos", category: "SEGURIDAD", resultType: "NUMERIC", unit: "mm", minValue: 1.6, severity: "GRAVE", description: "Profundidad mínima de labrado" },
    { code: "SEG_005", name: "Sistema de luces", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar faros, luces de freno, intermitentes y neblineros" },
    { code: "SEG_006", name: "Cinturones de seguridad", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar funcionamiento y anclajes" },
    { code: "SEG_007", name: "Limpia parabrisas", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "LEVE", description: "Verificar estado de gomas y funcionamiento" },
    { code: "SEG_008", name: "Espejos retrovisores", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "LEVE", description: "Verificar estado y ajuste" },
    { code: "MED_001", name: "Emisiones de gases", category: "MEDIOAMBIENTE", resultType: "NUMERIC", unit: "%", maxValue: 1.0, severity: "CRITICA", description: "Nivel de CO en emisiones" },
    { code: "MED_002", name: "Fugas de fluidos", category: "MEDIOAMBIENTE", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar fugas de aceite, refrigerante o combustible" },
    { code: "MED_003", name: "Sistema de escape", category: "MEDIOAMBIENTE", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar integridad y fugas" },
    { code: "DOC_001", name: "Número de chasis", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar coincidencia con documentación" },
    { code: "DOC_002", name: "Placa visible", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar legibilidad y fijación" },
  ],
  MOTO: [
    { code: "SEG_M01", name: "Sistema de frenos", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar freno delantero y trasero" },
    { code: "SEG_M02", name: "Neumáticos", category: "SEGURIDAD", resultType: "NUMERIC", unit: "mm", minValue: 1.0, severity: "GRAVE", description: "Profundidad mínima de labrado" },
    { code: "SEG_M03", name: "Sistema de luces", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar faro, luz de freno e intermitentes" },
    { code: "SEG_M04", name: "Suspensión", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar horquilla y amortiguador" },
    { code: "SEG_M05", name: "Espejos", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "LEVE", description: "Verificar presencia y estado" },
    { code: "MED_M01", name: "Emisiones de gases", category: "MEDIOAMBIENTE", resultType: "NUMERIC", unit: "%", maxValue: 1.5, severity: "CRITICA", description: "Nivel de CO en emisiones" },
    { code: "MED_M02", name: "Sistema de escape", category: "MEDIOAMBIENTE", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar integridad y ruido" },
    { code: "DOC_M01", name: "Número de chasis", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar coincidencia con documentación" },
    { code: "DOC_M02", name: "Placa visible", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar legibilidad y fijación" },
  ],
  CAMION: [
    { code: "SEG_C01", name: "Sistema de frenos", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar sistema de frenos de servicio y estacionamiento" },
    { code: "SEG_C02", name: "Sistema de dirección", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar columna, caja y terminales con holguras" },
    { code: "SEG_C03", name: "Sistema de suspensión", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar ballestas, amortiguadores y bujes" },
    { code: "SEG_C04", name: "Neumáticos", category: "SEGURIDAD", resultType: "NUMERIC", unit: "mm", minValue: 2.0, severity: "CRITICA", description: "Profundidad mínima de labrado (mayor por carga)" },
    { code: "SEG_C05", name: "Sistema de luces", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar luces delanteras, traseras, laterales y de freno" },
    { code: "SEG_C06", name: "Triángulos y señales", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "LEVE", description: "Verificar presencia de equipo de seguridad" },
    { code: "SEG_C07", name: "Carrocería y carga", category: "SEGURIDAD", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar integridad y sistemas de sujeción" },
    { code: "MED_C01", name: "Emisiones de gases", category: "MEDIOAMBIENTE", resultType: "NUMERIC", unit: "%", maxValue: 2.0, severity: "CRITICA", description: "Nivel de opacidad en diésel" },
    { code: "MED_C02", name: "Fugas de fluidos", category: "MEDIOAMBIENTE", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar fugas de aceite, refrigerante o combustible" },
    { code: "MED_C03", name: "Sistema de escape", category: "MEDIOAMBIENTE", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar integridad y fugas" },
    { code: "DOC_C01", name: "Número de chasis", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar coincidencia con documentación" },
    { code: "DOC_C02", name: "Placa visible", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "CRITICA", description: "Verificar legibilidad y fijación" },
    { code: "DOC_C03", name: "Peso y dimensiones", category: "DOCUMENTAL", resultType: "BOOLEAN", severity: "GRAVE", description: "Verificar cumplimiento de límites legales" },
  ],
};

/* =====================
   Helper: export CSV
   ===================== */
function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")]
    .concat(rows.map((r) => keys.map((k) => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* =====================
   Top menu component
   ===================== */
function TopMenu({ loggedIn, onToggleLogin, goPortal }) {
  return (
    <header className="flex justify-between items-center p-4 shadow bg-white">
      <nav className="flex gap-4 items-center">
        <button onClick={() => goPortal("home")} className="flex items-center gap-1 text-sm">
          <Home className="w-4 h-4" /> Inicio
        </button>
        <button className="flex items-center gap-1 text-sm">
          <Info className="w-4 h-4" /> Sobre
        </button>
        <button className="flex items-center gap-1 text-sm">
          <Briefcase className="w-4 h-4" /> Servicios
        </button>
        <button className="flex items-center gap-1 text-sm">
          <Phone className="w-4 h-4" /> Contacto
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLogin}
          className="px-3 py-1 rounded text-sm"
          style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}
        >
          {loggedIn ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
        <button aria-label="alertas" title="Alertas">
          <Bell className="w-5 h-5" color={COLORS.intrantBlue} />
        </button>
        <button aria-label="ajustes" title="Ajustes">
          <Settings className="w-5 h-5" color={COLORS.intrantBlue} />
        </button>
      </div>
    </header>
  );
}

/* =====================
   Sidebar component
   ===================== */
function Sidebar({ role, page, setPage, username }) {
  const MenuButton = ({ Icon, label, target }) => (
    <button
      onClick={() => setPage(target)}
      className={`flex gap-2 items-center p-2 rounded text-left w-full ${page === target ? "font-semibold" : ""}`}
      style={{ color: page === target ? COLORS.intrantOrange : COLORS.intrantBlue }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  // admin sees more options
  const common = [
    { Icon: BarChart2, label: "Dashboard", target: "dashboard" },
    { Icon: Car, label: "Vehículos", target: "vehicles" },
    { Icon: FileCheck, label: "Inspecciones", target: "inspections" },
    { Icon: Users, label: "Inspectores", target: "inspectors" },
    { Icon: FileCheck, label: "Certificados", target: "certificates" },
    { Icon: Bell, label: "Notificaciones", target: "notifications" },
  ];

  const adminOnly = [
    { Icon: Settings, label: "Admin: Usuarios/Talleres", target: "admin" },
    { Icon: BarChart2, label: "Reportes", target: "reports" },
  ];

  const supervisorOnly = [
    { Icon: Users, label: "Gestión de Inspectores", target: "supervisor" },
  ];

  return (
    <aside className="w-72 p-4 border-r bg-white">
      <div className="text-center mb-6">
        <div style={{ width: 72, height: 72, margin: "0 auto", borderRadius: 999, background: COLORS.intrantOrange, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
          LOGO
        </div>
        <div style={{ color: COLORS.intrantBlue, marginTop: 8 }}>{username}</div>
        <div className="text-xs text-gray-500 mt-1">{role}</div>
      </div>

    <nav className="flex flex-col gap-2">
      {common.map((m) => <MenuButton key={m.target} Icon={m.Icon} label={m.label} target={m.target} />)}
      {role === "Administrador" && adminOnly.map((m) => <MenuButton key={m.target} Icon={m.Icon} label={m.label} target={m.target} />)}
      {role === "Supervisor" && supervisorOnly.map((m) => <MenuButton key={m.target} Icon={m.Icon} label={m.label} target={m.target} />)}
    </nav>
    </aside>
  );
}

/* =====================
   Portal selection (Titular/Taller/Admin)
   ===================== */
function PortalSelect({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.grayBg }}>
      <div className="bg-white p-8 rounded shadow w-[880px]">
        <h1 className="text-2xl font-bold mb-4" style={{ color: COLORS.intrantBlue }}>Selecciona tu portal</h1>
        <p className="text-sm text-gray-600 mb-4">Elige si entras como Titular, Taller o Administrador.</p>
        <div className="flex gap-4">
          <div className="flex-1 p-6 border rounded text-center">
            <h3 className="font-semibold">Titular</h3>
            <p className="text-sm text-gray-600 my-2">Accede a tus vehículos y certificados</p>
            <button onClick={() => onSelect("Titular")} className="mt-3 px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Entrar como Titular</button>
          </div>
          <div className="flex-1 p-6 border rounded text-center">
            <h3 className="font-semibold">Taller</h3>
            <p className="text-sm text-gray-600 my-2">Gestión de inspecciones y emisión</p>
            <button onClick={() => onSelect("Taller")} className="mt-3 px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Entrar como Taller</button>
          </div>
          <div className="flex-1 p-6 border rounded text-center">
            <h3 className="font-semibold">Administrador</h3>
            <p className="text-sm text-gray-600 my-2">Panel administrativo y trazabilidad</p>
            <button onClick={() => onSelect("Administrador")} className="mt-3 px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Entrar como Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================
   Registration component
   ===================== */
function Register({ portal, onRegister }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [sentVerification, setSentVerification] = useState(false);

  function validate() {
    if (!form.firstName || !form.lastName) return "Nombre y apellido requeridos.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido.";
    if (!form.password || form.password.length < 6) return "Contraseña mínimo 6 caracteres.";
    if (form.password !== form.confirm) return "Las contraseñas no coinciden.";
    if (!form.idNumber) return "Cédula/RNC requerido.";
    if (!form.phone) return "Teléfono requerido.";
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    setSentVerification(true);
    onRegister({ ...form, portal, verified: false, firstLogin: true });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.intrantBlue }}>Registro - {portal}</h2>
      {!sentVerification ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Nombre</label>
              <input 
                value={form.firstName} 
                onChange={(e)=>setForm({...form, firstName:e.target.value})} 
                placeholder="Nombre" 
                className="border p-2 rounded w-full" 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Apellido</label>
              <input 
                value={form.lastName} 
                onChange={(e)=>setForm({...form, lastName:e.target.value})} 
                placeholder="Apellido" 
                className="border p-2 rounded w-full" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Cédula / RNC</label>
              <input 
                value={form.idNumber} 
                onChange={(e)=>setForm({...form, idNumber:e.target.value})} 
                placeholder="Ej: 001-0000001-0" 
                className="border p-2 rounded w-full" 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Teléfono</label>
              <input 
                value={form.phone} 
                onChange={(e)=>setForm({...form, phone:e.target.value})} 
                placeholder="Ej: +1-809-1234567" 
                className="border p-2 rounded w-full" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Correo electrónico</label>
            <input 
              value={form.email} 
              onChange={(e)=>setForm({...form, email:e.target.value})} 
              placeholder="Correo electrónico" 
              className="border p-2 rounded w-full" 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Contraseña</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e)=>setForm({...form, password:e.target.value})} 
                placeholder="Mínimo 6 caracteres" 
                className="border p-2 rounded w-full" 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Confirmar contraseña</label>
              <input 
                type="password" 
                value={form.confirm} 
                onChange={(e)=>setForm({...form, confirm:e.target.value})} 
                placeholder="Confirmar contraseña" 
                className="border p-2 rounded w-full" 
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button 
              type="submit" 
              className="px-4 py-2 rounded text-white font-medium hover:opacity-90"
              style={{ backgroundColor: COLORS.intrantOrange }}
            >
              Enviar registro
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <p className="text-sm text-green-800 font-medium">✓ Correo de verificación enviado</p>
          <p className="text-sm text-green-700 mt-2">Se ha enviado un correo de verificación a <b>{form.email}</b></p>
          <p className="text-sm text-green-700 mt-1">Por favor confirma tu correo para completar el registro.</p>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => setSentVerification(false)} 
              className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
            >
              ← Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   Login component
   ===================== */
function Login({ onLogin, onForgot }) {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!creds.email || !creds.password) return setError("Completa correo y contraseña.");
    setError("");
    onLogin(creds);
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.intrantBlue }}>Iniciar sesión</h2>
      <form onSubmit={submit} className="space-y-2">
        <input value={creds.email} onChange={(e)=>setCreds({...creds, email:e.target.value})} placeholder="Correo o usuario" className="border p-2 rounded w-full" />
        <input value={creds.password} onChange={(e)=>setCreds({...creds, password:e.target.value})} type="password" placeholder="Contraseña" className="border p-2 rounded w-full" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex justify-between items-center">
          <button type="submit" className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>
            Iniciar sesión
          </button>
          <button type="button" onClick={onForgot} className="text-sm text-blue-600">¿Olvidó su contraseña?</button>
        </div>
      </form>
    </div>
  );
}

/* =====================
   Vehicle detail / register
   ===================== */
function VehicleRegister({ owners, onAdd }) {
  const [form, setForm] = useState({ 
    vin: "", 
    plate: "", 
    brand: "", 
    model: "", 
    year: "", 
    color: "", 
    fuel: "GASOLINA",
    type: "AUTO",
    ownerId: "", 
    files: [],
    mileage: ""
  });
  const [error, setError] = useState("");

  // Datos de dropdowns según base de datos
  const FUEL_TYPES = [
    { code: "GASOLINA", label: "Gasolina" },
    { code: "DIESEL", label: "Diésel" },
    { code: "GLP", label: "Gas Licuado de Petróleo (GLP)" },
    { code: "GNV", label: "Gas Natural Vehicular (GNV)" },
    { code: "ELECTRICO", label: "Eléctrico" },
    { code: "HIBRIDO", label: "Híbrido" },
  ];

  const VEHICLE_TYPES = [
    { code: "AUTO", label: "Automóvil" },
    { code: "MOTO", label: "Motocicleta" },
    { code: "CAMION", label: "Camión" },
    { code: "BUS", label: "Autobús" },
    { code: "VAN", label: "Camioneta/Van" },
  ];

  const BRANDS = [
    "Toyota", "Nissan", "Honda", "Hyundai", "Kia", "Mitsubishi", "Suzuki",
    "Chevrolet", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi",
    "Lexus", "Infiniti", "Mazda", "Subaru", "Isuzu", "Daihatsu", "Peugeot"
  ];

  const MODELS_BY_BRAND = {
    Toyota: ["Corolla", "Camry", "RAV4", "Prado", "Hilux", "Yaris", "Prius"],
    Nissan: ["Sentra", "Altima", "X-Trail", "Pathfinder", "Frontier", "Versa", "Leaf"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit", "HR-V"],
    Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "i10"],
    Kia: ["Rio", "Cerato", "Sportage", "Sorento", "Picanto", "Soul"],
    Ford: ["Focus", "Fiesta", "Explorer", "F-150", "EcoSport"],
    Chevrolet: ["Aveo", "Cruze", "Captiva", "Silverado", "Spark"],
    BMW: ["320", "X3", "X5", "Serie 7", "M3"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLE", "S-Class"],
  };

  const YEARS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);

  const COLORS = [
    "Blanco", "Negro", "Gris", "Rojo", "Azul", "Verde", "Amarillo",
    "Naranja", "Marrón", "Plateado", "Dorado", "Beige"
  ];

  function validateVIN(v) {
    return v && v.length >= 11 && v.length <= 17;
  }

  function submit(e) {
    e.preventDefault();
    if (!form.plate) return setError("Placa requerida.");
    if (!validateVIN(form.vin)) return setError("VIN inválido (11-17 caracteres).");
    if (!form.brand) return setError("Marca requerida.");
    if (!form.model) return setError("Modelo requerido.");
    if (!form.year) return setError("Año requerido.");
    if (!form.ownerId) return setError("Titular requerido.");
    if (!form.mileage) return setError("Kilometraje requerido.");
    
    setError("");
    
    const newV = {
      vin: form.vin,
      plate: form.plate,
      brand: form.brand,
      model: form.model,
      year: form.year,
      color: form.color || "No especificado",
      fuel: form.fuel,
      type: form.type,
      ownerId: form.ownerId,
      mileage: parseInt(form.mileage),
      documents: form.files,
      status: "ACTIVE"
    };
    
    onAdd(newV);
    setForm({ 
      vin: "", 
      plate: "", 
      brand: "", 
      model: "", 
      year: "", 
      color: "", 
      fuel: "GASOLINA",
      type: "AUTO",
      ownerId: "", 
      files: [],
      mileage: ""
    });
  }

  const fileInputRef = useRef(null);
  const handleFiles = (files) => {
    const arr = Array.from(files);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, files: [...prev.files, { name: f.name, data: ev.target.result }] }));
      };
      reader.readAsDataURL(f);
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Registrar vehículo</h3>
      <form onSubmit={submit} className="space-y-3">
        
        {/* VIN y Placa */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">VIN</label>
            <input 
              value={form.vin} 
              onChange={(e)=>setForm({...form, vin:e.target.value})} 
              placeholder="VIN (11-17 caracteres)" 
              className="border p-2 rounded w-full" 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Placa</label>
            <input 
              value={form.plate} 
              onChange={(e)=>setForm({...form, plate:e.target.value.toUpperCase()})} 
              placeholder="Placa" 
              className="border p-2 rounded w-full" 
            />
          </div>
        </div>

        {/* Tipo y Combustible */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Tipo de vehículo</label>
            <select 
              value={form.type} 
              onChange={(e)=>setForm({...form, type:e.target.value})} 
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar tipo</option>
              {VEHICLE_TYPES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Combustible</label>
            <select 
              value={form.fuel} 
              onChange={(e)=>setForm({...form, fuel:e.target.value})} 
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar combustible</option>
              {FUEL_TYPES.map(f => <option key={f.code} value={f.code}>{f.label}</option>)}
            </select>
          </div>
        </div>

        {/* Marca y Modelo */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Marca</label>
            <select 
              value={form.brand} 
              onChange={(e)=>setForm({...form, brand:e.target.value, model:""})} 
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar marca</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Modelo</label>
            <select 
              value={form.model} 
              onChange={(e)=>setForm({...form, model:e.target.value})} 
              className="border p-2 rounded w-full"
              disabled={!form.brand}
            >
              <option value="">Seleccionar modelo</option>
              {form.brand && MODELS_BY_BRAND[form.brand]?.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Año y Color */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Año</label>
            <select 
              value={form.year} 
              onChange={(e)=>setForm({...form, year:e.target.value})} 
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar año</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Color</label>
            <select 
              value={form.color} 
              onChange={(e)=>setForm({...form, color:e.target.value})} 
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar color</option>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Kilometraje */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Kilometraje actual</label>
          <input 
            value={form.mileage} 
            onChange={(e)=>setForm({...form, mileage:e.target.value})} 
            placeholder="Ej: 50000" 
            type="number"
            min="0"
            className="border p-2 rounded w-full" 
          />
        </div>

        {/* Titular */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Titular</label>
          <select 
            value={form.ownerId} 
            onChange={(e)=>setForm({...form, ownerId:e.target.value})} 
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccionar titular</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.fullName} — {o.document}</option>)}
          </select>
        </div>

        {/* Documentos */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Documentos adjuntos</label>
          <div className="flex items-center gap-2">
            <input 
              ref={fileInputRef} 
              onChange={(e)=>handleFiles(e.target.files)} 
              type="file" 
              multiple 
              accept="image/*,application/pdf"
              className="text-sm"
            />
            <button 
              type="button" 
              onClick={()=>fileInputRef.current && fileInputRef.current.click()} 
              className="px-2 py-1 rounded border text-sm hover:bg-gray-50"
            >
              Seleccionar
            </button>
          </div>
        </div>

        {form.files.length > 0 && (
          <div className="bg-blue-50 p-2 rounded">
            {form.files.map((f, idx) => <div key={idx} className="text-sm text-gray-600">✓ {f.name}</div>)}
          </div>
        )}

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">⚠ {error}</div>}

        <div className="flex justify-end gap-2">
          <button 
            type="submit" 
            className="px-3 py-2 rounded text-white font-medium hover:opacity-90" 
            style={{ backgroundColor: COLORS.intrantOrange }}
          >
            Registrar vehículo
          </button>
        </div>
      </form>
    </div>
  );
}
/* =====================
   Schedule inspection
   ===================== */
function ScheduleInspection({ vehicles, inspectors, talleres, onSchedule, userRole, userWorkshopId }) {
  const [form, setForm] = useState({ 
    vehiclePlate: "", 
    templateId: "", 
    date: "", 
    time: "", 
    inspectorId: "", 
    workshopId: "",
    notes: "" 
  });
  const [error, setError] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  // Filter inspectors based on role
  const availableInspectors = userRole === "Inspector" || userRole === "Supervisor" 
    ? inspectors.filter(i => i.workshopId === userWorkshopId)
    : inspectors;
  
  const userWorkshop = talleres.find(t => t.id === userWorkshopId);

  // Si el usuario es Inspector/Supervisor, solo mostrar su taller
  const availableTalleres = userRole === "Inspector" || userRole === "Supervisor" 
    ? talleres.filter(t => t.id === userWorkshopId)
    : talleres;

  function submit(e) {
    e.preventDefault();
    if (!form.vehiclePlate) return setError("Selecciona vehículo.");
    if (!form.templateId) return setError("Selecciona plantilla de inspección.");
    if (!form.date) return setError("Fecha requerida.");
    if (!form.workshopId) return setError("Taller requerido.");
    if (!form.inspectorId) return setError("Inspector requerido.");
    setError("");
    
    const vehicle = vehicles.find(v => v.plate === form.vehiclePlate);
    const inspector = inspectors.find(i => i.id === form.inspectorId);
    const workshop = talleres.find(t => t.id === form.workshopId);
    
    const schedule = {
      vehiclePlate: form.vehiclePlate,
      vehicleId: vehicle?.id,
      vehicleType: vehicle?.type || "AUTO",
      templateId: form.templateId,
      datetime: `${form.date} ${form.time || "09:00"}`,
      inspectorId: form.inspectorId,
      inspector: inspector?.name || "No asignado",
      workshopId: form.workshopId,
      taller: workshop?.name || "No asignado",
      notes: form.notes,
    };
    onSchedule(schedule);
    setForm({ 
      vehiclePlate: "", 
      templateId: "", 
      date: "", 
      time: "", 
      inspectorId: "", 
      workshopId: "",
      notes: "" 
    });
    setSelectedVehicleType("");
  }

  const handleVehicleChange = (plate) => {
    const vehicle = vehicles.find(v => v.plate === plate);
    setForm({...form, vehiclePlate: plate, templateId: ""});
    setSelectedVehicleType(vehicle?.type || "");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Programar inspección</h3>
      <form onSubmit={submit} className="space-y-3">
        
        {/* Vehículo */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Vehículo *</label>
          <select 
            value={form.vehiclePlate} 
            onChange={(e)=>handleVehicleChange(e.target.value)} 
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccionar vehículo</option>
            {vehicles.map(v=> (
              <option key={v.id} value={v.plate}>
                {v.plate} — {v.brand} {v.model}
              </option>
            ))}
          </select>
        </div>

        {/* Plantilla (se muestra solo si seleccionó vehículo) */}
        {selectedVehicleType && (
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Plantilla de inspección *</label>
            <select 
              value={form.templateId} 
              onChange={(e)=>setForm({...form, templateId:e.target.value})} 
              className="border p-2 rounded w-full bg-blue-50"
            >
              <option value="">Seleccionar plantilla</option>
              <option value={`TEMPLATE_${selectedVehicleType}`}>
                Inspección {selectedVehicleType === "AUTO" ? "Automóvil" : 
                           selectedVehicleType === "MOTO" ? "Motocicleta" : "Camión"}
              </option>
            </select>
            <p className="text-xs text-green-600 mt-1">✓ Plantilla cargada según tipo de vehículo</p>
          </div>
        )}

        {/* Taller - OBLIGATORIO */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Taller *</label>
          <select 
            value={form.workshopId} 
            onChange={(e)=>setForm({...form, workshopId:e.target.value})} 
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccionar taller</option>
            {availableTalleres.map(t=> (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Fecha *</label>
            <input 
              value={form.date} 
              onChange={(e)=>setForm({...form, date:e.target.value})} 
              type="date" 
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Hora</label>
            <input 
              value={form.time} 
              onChange={(e)=>setForm({...form, time:e.target.value})} 
              type="time" 
              className="border p-2 rounded w-full"
              placeholder="09:00"
            />
          </div>
        </div>

        {/* Inspector */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Inspector asignado *</label>
          <select 
            value={form.inspectorId} 
            onChange={(e)=>setForm({...form, inspectorId:e.target.value})} 
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccionar inspector</option>
            {availableInspectors.map(i=> (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Observaciones</label>
          <textarea 
            value={form.notes} 
            onChange={(e)=>setForm({...form, notes:e.target.value})} 
            placeholder="Ej: Reinspección, primer verificación, etc." 
            className="border p-2 rounded w-full text-sm"
            rows="2"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            ⚠ {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button 
            type="submit" 
            className="px-4 py-2 rounded text-white font-medium hover:opacity-90"
            style={{ backgroundColor: COLORS.intrantOrange }}
          >
            Programar inspección
          </button>
        </div>
      </form>
    </div>
  );
}

/* =====================
   Execute inspection (checklist + photos)
   ===================== */
function ExecuteInspection({ inspection, onSaveProgress, onFinish, onCancel }) {
  // Get template based on vehicle type
  const template = INSPECTION_TEMPLATES[inspection.vehicleType] || INSPECTION_TEMPLATES.AUTO;
  
  const [items, setItems] = useState(() => 
    template.map((it) => ({ 
      code: it.code,
      name: it.name, 
      category: it.category,
      description: it.description,
      resultType: it.resultType,
      unit: it.unit,
      minValue: it.minValue,
      maxValue: it.maxValue,
      severity: it.severity,
      status: "No aplica", 
      valueBoolean: null,
      valueNumeric: "",
      comment: "", 
      photos: [],
      defectSeverity: "",
      defectDescription: ""
    }))
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const done = items.filter(it => it.status !== "No aplica" && it.status !== "").length;
    setProgress(Math.round((done / items.length) * 100));
  }, [items]);

  const handlePhoto = (file, itemCode) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setItems(prev => prev.map(it => it.code === itemCode ? { ...it, photos: [...it.photos, { name: file.name, data: ev.target.result }] } : it));
    };
    reader.readAsDataURL(file);
  };

  const updateItem = (itemCode, patch) => setItems(prev => prev.map(it => it.code === itemCode ? { ...it, ...patch } : it));

  const renderItemInput = (item) => {
    if (item.resultType === "BOOLEAN") {
      return (
        <select value={item.status} onChange={(e)=>{
          const newStatus = e.target.value;
          updateItem(item.code, { 
            status: newStatus, 
            valueBoolean: newStatus === "Aprobado" ? true : newStatus === "Falla" ? false : null,
            defectSeverity: newStatus === "Falla" ? item.severity : "",
            defectDescription: newStatus === "Falla" ? "" : ""
          });
        }} className="border p-1 rounded">
          <option>No aplica</option>
          <option>Aprobado</option>
          <option>Falla</option>
        </select>
      );
    } else if (item.resultType === "NUMERIC") {
      return (
        <div className="flex gap-2 items-center">
          <input 
            type="number" 
            step="0.01"
            value={item.valueNumeric} 
            onChange={(e)=>{
              const val = parseFloat(e.target.value);
              const passes = (!item.minValue || val >= item.minValue) && (!item.maxValue || val <= item.maxValue);
              updateItem(item.code, { 
                valueNumeric: e.target.value,
                status: e.target.value === "" ? "No aplica" : passes ? "Aprobado" : "Falla",
                defectSeverity: !passes && e.target.value !== "" ? item.severity : "",
                defectDescription: !passes && e.target.value !== "" ? "" : ""
              });
            }} 
            placeholder={`${item.unit || ""}`}
            className="border p-1 rounded w-24" 
          />
          <span className="text-xs text-gray-600">
            {item.minValue && `≥${item.minValue}`}
            {item.minValue && item.maxValue && " / "}
            {item.maxValue && `≤${item.maxValue}`}
            {item.unit && ` ${item.unit}`}
          </span>
        </div>
      );
    }
    return null;
  };

  const getCategoryColor = (cat) => {
    if (cat === "SEGURIDAD") return "bg-red-100 text-red-800";
    if (cat === "MEDIOAMBIENTE") return "bg-green-100 text-green-800";
    if (cat === "DOCUMENTAL") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Ejecutar inspección - Vehículo {inspection.vehicle}</h3>
          <div className="text-sm text-gray-600">Plantilla: {inspection.vehicleType === "AUTO" ? "Automóvil" : inspection.vehicleType === "MOTO" ? "Motocicleta" : "Camión"}</div>
        </div>
        <div className="text-sm text-gray-600">Progreso: {progress}%</div>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.code} className="p-3 border rounded">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(it.category)}`}>{it.category}</span>
                  <span className="font-medium">{it.name}</span>
                  <span className="text-xs text-gray-500">({it.code})</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">{it.description}</div>
              </div>
            </div>
            
            <div className="flex gap-2 items-start flex-wrap">
              <div className="flex gap-2 items-center">
                {renderItemInput(it)}
              </div>
              
              <input 
                placeholder="Comentario adicional" 
                value={it.comment} 
                onChange={(e)=>updateItem(it.code, { comment: e.target.value })} 
                className="border p-1 rounded text-sm flex-1 min-w-[200px]" 
              />
              
              <label className="p-1 rounded border cursor-pointer text-sm flex items-center gap-1 hover:bg-gray-50">
                <Camera className="w-4 h-4"/>
                <input 
                  onChange={(e)=>e.target.files && handlePhoto(e.target.files[0], it.code)} 
                  type="file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                />
                Foto
              </label>
            </div>

            {it.status === "Falla" && (
              <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                <div className="font-medium text-sm text-red-800 mb-2">⚠ Defecto detectado</div>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={it.defectSeverity} 
                    onChange={(e)=>updateItem(it.code, { defectSeverity: e.target.value })} 
                    className="border p-2 rounded"
                  >
                    <option value="">Clasificar severidad</option>
                    <option value="LEVE">Leve</option>
                    <option value="GRAVE">Grave</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                  <input 
                    placeholder="Descripción del defecto" 
                    value={it.defectDescription} 
                    onChange={(e)=>updateItem(it.code, { defectDescription: e.target.value })} 
                    className="border p-2 rounded" 
                  />
                </div>
                {it.severity && (
                  <div className="text-xs text-gray-600 mt-1">
                    Severidad sugerida según normativa: <b>{it.severity}</b>
                  </div>
                )}
              </div>
            )}

            {it.photos.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {it.photos.map((p, idx) => (
                  <img 
                    key={idx} 
                    src={p.data} 
                    alt={p.name} 
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button 
          onClick={() => onSaveProgress({ inspectionId: inspection.id, items })} 
          className="px-3 py-2 rounded border hover:bg-gray-50"
        >
          <Save className="w-4 h-4 inline mr-1" />
          Guardar progreso
        </button>
        <button 
          onClick={() => onCancel(inspection.id)} 
          className="px-3 py-2 rounded border hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button 
          onClick={() => onFinish({ ...inspection, items })} 
          className="px-3 py-2 rounded" 
          style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}
        >
          Finalizar inspección
        </button>
      </div>
    </div>
  );
}

/* =====================
   Certificates list / detail
   ===================== */
function CertificatesView({ certificates, onSelect, selected, viewDetail, onCloseDetail }) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Certificados</h2>
        <div className="p-4 rounded shadow bg-white mt-3">
          <table className="w-full text-left">
            <thead className="bg-[#FFF4E5]">
              <tr><th className="p-2">ID</th><th className="p-2">Vehículo</th><th className="p-2">Fecha</th><th className="p-2">Estado</th></tr>
            </thead>
            <tbody>
              {certificates.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={()=>onSelect(c)}>
                  <td className="p-2">{c.id}</td>
                  <td className="p-2">{c.vehicle}</td>
                  <td className="p-2">{c.date}</td>
                  <td className="p-2">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && !viewDetail && (
        <aside className="w-80 p-4 rounded shadow bg-white">
          <h3 className="font-semibold">Certificado {selected.id}</h3>
          <p><b>Vehículo:</b> {selected.vehicle}</p>
          <p><b>Fecha:</b> {selected.date}</p>
          <p><b>Estado:</b> {selected.status}</p>
          <div className="mt-3 flex items-center justify-center" style={{ width: "100%", height: 120, background: "#000", color: "#fff", fontWeight:700 }}>QR</div>
          <button onClick={()=>onSelect(selected) & window.scrollTo({top:0, behavior:'smooth'})} className="mt-3 px-3 py-2 w-full rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Más</button>
        </aside>
      )}

      {selected && viewDetail && (
        <div className="p-6 rounded shadow bg-white flex-1 relative">
          <button onClick={onCloseDetail} className="absolute top-4 left-4 px-2 py-1 bg-gray-100 rounded flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          <div style={{ marginTop: 48 }}>
            <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Certificado #{selected.id}</h2>
            <div className="flex gap-6 mt-4">
              <div className="flex-1">
                <p><b>Vehículo:</b> {selected.vehicle}</p>
                <p><b>Emitido:</b> {selected.date}</p>
                <p><b>Estado:</b> {selected.status}</p>
                <p className="text-sm text-gray-600 mt-2">{selected.details}</p>
              </div>
              <div style={{ width: 160, height: 160, background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                QR
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   Notifications view
   ===================== */
function NotificationsView({ notifications, onRetry }) {
  return (
    <div>
      <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Notificaciones</h2>
      <div className="p-4 rounded shadow bg-white mt-3">
        {notifications.map(n => (
          <div key={n.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-600">{n.message}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className={`text-sm ${n.status === 'Entregado' ? 'text-green-600' : 'text-red-600'}`}>{n.status}</div>
              {n.status !== 'Entregado' && <button onClick={()=>onRetry(n.id)} className="mt-2 px-2 py-1 text-xs rounded border">Reintentar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================
   Admin panel 
   ===================== */
function AdminPanel({ users, setUsers, talleres, setTalleres }) {
  const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "Inspector", workshopId: "" });
  const [newTaller, setNewTaller] = useState({ name: "", rnc: "" });

  const addUser = () => {
    if (!newUser.fullName || !newUser.email) return;
    const userData = { 
      id: Date.now().toString(), 
      ...newUser,
      verified: true,
      firstLogin: true,
      document: `DOC-${Date.now()}`
    };
    setUsers(prev => [userData, ...prev]);
    setNewUser({ fullName: "", email: "", role: "Inspector", workshopId: "" });
  };
  
  const delUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  
  const addTaller = () => { 
    if (!newTaller.name || !newTaller.rnc) return; 
    setTalleres(prev => [{ id: `w${Date.now()}`, ...newTaller }, ...prev]); 
    setNewTaller({ name: "", rnc: "" }); 
  };
  
  const delTaller = (id) => setTalleres(prev => prev.filter(x => x.id !== id));

  return (
    <div>
      <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Administración</h2>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Usuarios del Sistema</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input value={newUser.fullName} onChange={e=>setNewUser({...newUser, fullName:e.target.value})} placeholder="Nombre completo" className="border p-2 rounded flex-1" />
              <input value={newUser.email} onChange={e=>setNewUser({...newUser, email:e.target.value})} placeholder="Correo" className="border p-2 rounded flex-1" />
            </div>
            <div className="flex gap-2">
              <select value={newUser.role} onChange={e=>setNewUser({...newUser, role:e.target.value})} className="border p-2 rounded flex-1">
                <option>Inspector</option>
                <option>Supervisor</option>
                <option>Administrador</option>
                <option>Titular</option>
              </select>
              {(newUser.role === "Inspector" || newUser.role === "Supervisor") && (
                <select value={newUser.workshopId} onChange={e=>setNewUser({...newUser, workshopId:e.target.value})} className="border p-2 rounded flex-1">
                  <option value="">Asignar taller</option>
                  {talleres.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              )}
              <button onClick={addUser} className="px-3 py-2 rounded flex items-center gap-1" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>
                <UserPlus className="w-4 h-4"/> Agregar
              </button>
            </div>

            <div className="mt-3 border-t pt-2 max-h-96 overflow-y-auto">
              {users.map(u=>(
                <div key={u.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{u.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {u.role} - {u.email}
                      {u.workshopId && ` - ${talleres.find(t => t.id === u.workshopId)?.name || "Taller no asignado"}`}
                    </div>
                  </div>
                  <button onClick={()=>delUser(u.id)} className="px-2 py-1 text-xs rounded border hover:bg-red-50 hover:text-red-600">Borrar</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Talleres Autorizados</h3>
          <div className="space-y-2">
            <input value={newTaller.name} onChange={e=>setNewTaller({...newTaller, name:e.target.value})} placeholder="Nombre del taller" className="border p-2 rounded w-full" />
            <div className="flex gap-2">
              <input value={newTaller.rnc} onChange={e=>setNewTaller({...newTaller, rnc:e.target.value})} placeholder="RNC" className="border p-2 rounded flex-1" />
              <button onClick={addTaller} className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Agregar</button>
            </div>
          </div>
          
          <div className="mt-3 border-t pt-2">
            {talleres.map(t=>(
              <div key={t.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.rnc}</div>
                </div>
                <button onClick={()=>delTaller(t.id)} className="px-2 py-1 text-xs rounded border hover:bg-red-50 hover:text-red-600">Borrar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================
   Supervisor panel 
   ===================== */
function SupervisorPanel({ users, setUsers, talleres, userWorkshopId }) {
  const [newInspector, setNewInspector] = useState({ fullName: "", email: "" });
  
  const userWorkshop = talleres.find(t => t.id === userWorkshopId);
  const workshopInspectors = users.filter(u => u.workshopId === userWorkshopId && u.role === "Inspector");

  const addInspector = () => {
    if (!newInspector.fullName || !newInspector.email) return;
    const inspectorData = { 
      id: Date.now().toString(), 
      fullName: newInspector.fullName,
      email: newInspector.email,
      role: "Inspector",
      workshopId: userWorkshopId,
      verified: true,
      firstLogin: true,
      document: `DOC-${Date.now()}`
    };
    setUsers(prev => [inspectorData, ...prev]);
    setNewInspector({ fullName: "", email: "" });
  };
  
  const delInspector = (id) => {
    if (window.confirm("¿Está seguro de eliminar este inspector?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Gestión de Inspectores</h2>
      <div className="text-sm text-gray-600 mb-4">Taller: <b>{userWorkshop?.name || "No asignado"}</b></div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Agregar Inspector</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input 
              value={newInspector.fullName} 
              onChange={e=>setNewInspector({...newInspector, fullName:e.target.value})} 
              placeholder="Nombre completo" 
              className="border p-2 rounded flex-1" 
            />
            <input 
              value={newInspector.email} 
              onChange={e=>setNewInspector({...newInspector, email:e.target.value})} 
              placeholder="Correo electrónico" 
              className="border p-2 rounded flex-1" 
            />
            <button 
              onClick={addInspector} 
              className="px-3 py-2 rounded flex items-center gap-1" 
              style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}
            >
              <UserPlus className="w-4 h-4"/> Agregar
            </button>
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <h3 className="font-semibold mb-2">Inspectores del Taller ({workshopInspectors.length})</h3>
          <div className="space-y-2">
            {workshopInspectors.map(inspector => (
              <div key={inspector.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div>
                  <div className="font-medium">{inspector.fullName}</div>
                  <div className="text-sm text-gray-600">{inspector.email}</div>
                  {inspector.firstLogin && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                      Pendiente primer inicio
                    </span>
                  )}
                </div>
                <button 
                  onClick={()=>delInspector(inspector.id)} 
                  className="px-3 py-1 text-sm rounded border hover:bg-red-50 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
            {workshopInspectors.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No hay inspectores asignados a este taller
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================
   Reports view (simple)
   ===================== */
function ReportsView({ inspections, certificates }) {
  // quick stats
  const totalIns = inspections.length;
  const approved = inspections.filter(i => i.result === "Aprobado").length;
  const rejected = inspections.filter(i => i.result === "Rechazado").length;

  const byTaller = {};
  inspections.forEach(i => { const t = i.taller || "Sin taller"; byTaller[t] = (byTaller[t]||0)+1; });
  const tallerSeries = Object.keys(byTaller).map(k => ({ taller: k, count: byTaller[k] }));

  return (
    <div>
      <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Reportes</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Inspecciones totales</div>
          <div className="text-2xl font-bold">{totalIns}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Aprobadas</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.intrantGreen }}>{approved}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Rechazadas</div>
          <div className="text-2xl font-bold" style={{ color: "red" }}>{rejected}</div>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Inspecciones por taller</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={tallerSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="taller" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={COLORS.intrantOrange} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* =====================
   Main App (estado global + flujo)
   ===================== */
export default function App() {
  /* Layout & auth */
  const [portal, setPortal] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loggedUser, setLoggedUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [execInspection, setExecInspection] = useState(null);

  /* Data stores */
  const [users, setUsers] = useState([
    { id: "u1", fullName: "Carlos Pérez", email: "carlos@example.com", role: "Titular", document: "001-0000001-0", verified: true, firstLogin: false },
    { id: "u2", fullName: "Taller Los Robles", email: "taller@example.com", role: "Taller", document: "RNC-123456", verified: true, firstLogin: false, workshopId: "w1" },
    { id: "u3", fullName: "Admin INTRANT", email: "admin@example.com", role: "Administrador", document: "000", verified: true, firstLogin: false },
    { id: "u4", fullName: "María González", email: "maria@example.com", role: "Titular", document: "001-0000002-0", verified: true, firstLogin: false },
    { id: "u5", fullName: "Taller San Cristóbal", email: "tallersancristobal@example.com", role: "Taller", document: "RNC-789012", verified: true, firstLogin: false, workshopId: "w2" },
    { id: "u6", fullName: "Supervisor Taller Los Robles", email: "supervisor@losrobles.com", role: "Supervisor", document: "001-0000005-0", verified: true, firstLogin: false, workshopId: "w1" },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: "v1", plate: "A123456", vin: "1HGBH41JXMN109186", brand: "Toyota", model: "Corolla", year: 2020, color: "Blanco", fuel: "GASOLINA", owner: "Carlos Pérez", documents: [], type: "AUTO", mileage: 45000, status: "ACTIVE" },
    { id: "v2", plate: "B987654", vin: "JH4KA8260NC000000", brand: "Honda", model: "Civic", year: 2019, color: "Negro", fuel: "HIBRIDO", owner: "María González", documents: [], type: "AUTO", mileage: 62000, status: "ACTIVE" },
    { id: "v3", plate: "C555888", vin: "WBAVA37553NM12345", brand: "BMW", model: "X3", year: 2021, color: "Gris", fuel: "GASOLINA", owner: "Carlos Pérez", documents: [], type: "AUTO", mileage: 28000, status: "ACTIVE" },
    { id: "v4", plate: "D112233", vin: "1G1ZE5ST4HF123456", brand: "Chevrolet", model: "Malibu", year: 2018, color: "Azul", fuel: "GASOLINA", owner: "María González", documents: [], type: "AUTO", mileage: 78000, status: "ACTIVE" },
    { id: "v5", plate: "M555111", vin: "JH2SC5902MK000001", brand: "Honda", model: "CBR", year: 2020, color: "Rojo", fuel: "GASOLINA", owner: "Carlos Pérez", documents: [], type: "MOTO", mileage: 15000, status: "ACTIVE" },
    { id: "v6", plate: "T888999", vin: "3HSDJAPR8HN000001", brand: "Hino", model: "FC", year: 2019, color: "Blanco", fuel: "DIESEL", owner: "Transporte XYZ", documents: [], type: "CAMION", mileage: 125000, status: "ACTIVE" },
  ]);

  const [inspectors, setInspectors] = useState([
    { id: "ins1", name: "Juan Pérez Martínez", email: "juan.perez@taller.com", role: "Inspector", certification: "ITV-2023-001", workshopId: "w1" },
    { id: "ins2", name: "Ana Gómez Silva", email: "ana.gomez@taller.com", role: "Inspector", certification: "ITV-2023-002", workshopId: "w1" },
    { id: "ins3", name: "Roberto Fernández", email: "roberto.fernandez@taller.com", role: "Inspector", certification: "ITV-2023-003", workshopId: "w2" },
    { id: "ins4", name: "Carmen Rodríguez", email: "carmen.rodriguez@taller.com", role: "Inspector", certification: "ITV-2023-004", workshopId: "w2" },
  ]);

  const [talleres, setTalleres] = useState([
    { id: "w1", name: "Taller Los Robles", rnc: "RNC-123456" },
    { id: "w2", name: "Taller San Cristóbal", rnc: "RNC-789012" },
    { id: "w3", name: "Taller El Progreso", rnc: "RNC-456789" },
    { id: "w4", name: "Centro de Inspección San Cristóbal", rnc: "RNC-111222" },
    { id: "w5", name: "Taller Mecánico Central", rnc: "RNC-333444" },
    { id: "w6", name: "Inspecciones Técnicas del Este", rnc: "RNC-555666" },
  ]);

  const [scheduled, setScheduled] = useState([
    { id: "s1", vehicle: "A123456", vehicleType: "AUTO", templateId: "TEMPLATE_AUTO", datetime: "2025-09-25 09:00", inspectorId: "ins1", inspector: "Juan Pérez Martínez", workshopId: "w1", taller: "Taller Los Robles", status: "Programada", notes: "Primera inspección del año" },
    { id: "s2", vehicle: "B987654", vehicleType: "AUTO", templateId: "TEMPLATE_AUTO", datetime: "2025-09-26 14:00", inspectorId: "ins2", inspector: "Ana Gómez Silva", workshopId: "w2", taller: "Centro de Inspección San Cristóbal", status: "Programada", notes: "Inspección de rutina" },
    { id: "s3", vehicle: "C555888", vehicleType: "AUTO", templateId: "TEMPLATE_AUTO", datetime: "2025-09-27 10:30", inspectorId: "ins3", inspector: "Roberto Fernández", workshopId: "w3", taller: "Taller El Progreso", status: "En proceso", notes: "Verificación post-reparación" },
    { id: "s4", vehicle: "D112233", vehicleType: "AUTO", templateId: "TEMPLATE_AUTO", datetime: "2025-09-28 16:00", inspectorId: "ins4", inspector: "Carmen Rodríguez", workshopId: "w6", taller: "Inspecciones Técnicas del Este", status: "Programada", notes: "Inspección anual obligatoria" },
    { id: "s5", vehicle: "M555111", vehicleType: "MOTO", templateId: "TEMPLATE_MOTO", datetime: "2025-09-29 11:00", inspectorId: "ins1", inspector: "Juan Pérez Martínez", workshopId: "w1", taller: "Taller Los Robles", status: "Programada", notes: "Inspección motocicleta" },
  ]);

  const [inspections, setInspections] = useState([
    { id: "i1", vehicle: "A123456", date: "2025-09-15", result: "Aprobado", inspector: "Juan Pérez Martínez", taller: "Taller Los Robles", items: [] },
    { id: "i2", vehicle: "B987654", date: "2025-09-10", result: "Rechazado", inspector: "Ana Gómez Silva", taller: "Taller El Progreso", items: [] },
    { id: "i3", vehicle: "C555888", date: "2025-09-08", result: "Aprobado", inspector: "Roberto Fernández", taller: "Centro de Inspección San Cristóbal", items: [] },
    { id: "i4", vehicle: "D112233", date: "2025-09-05", result: "Rechazado", inspector: "Carmen Rodríguez", taller: "Inspecciones Técnicas del Este", items: [] },
    { id: "i5", vehicle: "A123456", date: "2025-09-01", result: "Aprobado", inspector: "Juan Pérez Martínez", taller: "Taller Los Robles", items: [] },
  ]);

  const [certificates, setCertificates] = useState([
    { id: "C-001", vehicle: "A123456", date: "2025-09-15", status: "Activo", details: "Certificado de inspección técnica vehicular válido hasta septiembre 2026.", expiryDate: "2026-09-15" },
    { id: "C-002", vehicle: "C555888", date: "2025-09-08", status: "Activo", details: "Certificado de inspección técnica vehicular válido hasta septiembre 2026.", expiryDate: "2026-09-08" },
    { id: "C-003", vehicle: "A123456", date: "2025-09-01", status: "Renovado", details: "Certificado anterior, reemplazado por C-001.", expiryDate: "2025-09-01" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Certificado disponible", message: "Certificado C-001 para vehículo A123456 está disponible para descarga", status: "Entregado" },
    { id: "n2", title: "Inspección programada", message: "Recordatorio: Inspección para B987654 el 26 de septiembre a las 2:00 PM", status: "Entregado" },
    { id: "n3", title: "Documento vencido", message: "El certificado del vehículo D112233 vence en 30 días", status: "Pendiente" },
    { id: "n4", title: "Resultado de inspección", message: "Inspección para B987654 ha sido rechazada. Requiere reparaciones", status: "Entregado" },
    { id: "n5", title: "Nuevo taller disponible", message: "Se ha agregado 'Inspecciones Técnicas del Este' a la red de talleres autorizados", status: "Pendiente" },
  ]);

  /* UI selection state */
  const [selectedCert, setSelectedCert] = useState(null);
  const [viewCertDetail, setViewCertDetail] = useState(false);

  /* =========================
     Auth / registration flow
     ========================= */
  const handleRegister = async (payload) => {
    try {
      let endpoint, requestData;

      if (payload.portal === "Titular") {
        endpoint = API_ENDPOINTS.REGISTER_HOLDER;
        requestData = {
          email: payload.email,
          password: payload.password,
          documentType: "CEDULA",
          documentNumber: payload.idNumber,
          fullNameOrCorporate: `${payload.firstName} ${payload.lastName}`,
          phone: payload.phone,
          addressLine: payload.optional || "",
          municipalityId: 1
        };
      } else {
        endpoint = API_ENDPOINTS.REGISTER;
        requestData = {
          email: payload.email,
          password: payload.password,
          phone: payload.phone
        };
      }

      const response = await httpService.post(endpoint, requestData);

      const newUser = {
        id: response.userId || Date.now().toString(),
        fullName: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        role: payload.portal === "Titular" ? "Titular" : payload.portal,
        document: payload.idNumber,
        verified: false,
        firstLogin: true,
      };

      setUsers(prev => [newUser, ...prev]);
      alert("Registro exitoso. Por favor verifica tu correo.");

    } catch (error) {
      alert(`Error en el registro: ${error.message}`);
    }
  };
    const handleLogin = async ({ email, password }) => {
        try {
            // 1. Petición de Login a la API
            const response = await httpService.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            });

            // 2. Establecer el Token
            // 'response.token' es la clave JWT necesaria para futuras peticiones.
            httpService.setToken(response.token);

            // 3. Mapear la Respuesta del Backend al Objeto de Usuario (user)

            // Obtener el rol: si 'roles' existe y tiene elementos, toma el primero. De lo contrario, asigna 'user'.
            const userRole = (response.roles && response.roles.length > 0)
                ? response.roles[0]
                : 'user';

            const user = {
                // Usamos 'response.userId' y 'response.email' que vienen directamente en la respuesta.
                id: response.userId,
                email: response.email,

                // Mapear propiedades opcionales o con diferente nombre:
                // Si 'fullName' no existe, usamos el email como nombre.
                fullName: response.fullName || response.email,

                // Mapeamos el rol del array (roles) al singular (role).
                role: userRole,

                // Mapeamos 'mustChangePassword' a 'firstLogin' (asumiendo que es la intención)
                firstLogin: response.mustChangePassword || false,

                // 'workshopId' puede ser nulo o indefinido, por lo que usamos 'null' como fallback.
                workshopId: response.workshopId || null,

                // 'verified' y 'status' (opcionalmente) se mantienen en la lógica del frontend.
                verified: response.status === 'ACTIVE',
            };

            // 4. Configurar el Estado de la Aplicación
            setLoggedUser(user);
            setRole(user.role);
            setLoggedIn(true);
            setPage("dashboard");

            // 5. Cargar Datos Adicionales (Acciones asíncronas necesarias tras el login)
            await loadUserVehicles();
            await loadCertificates();

        } catch (error) {
            // Manejo de errores: Muestra un mensaje amigable.
            // El 'failed to fetch' o el error 401/500 será atrapado aquí.
            console.error("Login Failed:", error);
            alert(`Error al iniciar sesión: ${error.message || "Por favor, verifica tus credenciales y la conexión."}`);
        }
    };
  const handleLogout = () => {
    httpService.setToken(null);
    setLoggedIn(false);
    setLoggedUser(null);
    setPortal(null);
    setRole(null);
    setPage("dashboard");
    setExecInspection(null);
  };

  /* =========================
     Vehicle handlers
     ========================= */
  const addVehicle = async (v) => {
    try {
      const requestData = {
        vin: v.vin,
        plate: v.plate,
        vehicleTypeCode: v.type || "AUTO",
        vehicleMakeName: v.brand,
        vehicleModelName: v.model,
        modelYear: parseInt(v.year),
        vehicleModelYearFrom: parseInt(v.year),
        fuelTypeCode: v.fuel || "GASOLINA",
        engineNumber: v.engineNumber || "",
        color: v.color,
        grossWeightKg: v.weight || 0,
        seatCount: v.seats || 5,
        imageUrl: v.imageUrl || "",
        initialHolderId: v.ownerId || loggedUser?.id
      };

      const response = await httpService.post(API_ENDPOINTS.VEHICLE_REGISTER, requestData);

      const newVehicle = {
        id: response.vehicleId,
        ...v,
        owner: users.find(u => u.id === v.ownerId)?.fullName || "Sin asignar"
      };

      setVehicles(prev => [newVehicle, ...prev]);
      alert("Vehículo registrado exitosamente");

    } catch (error) {
      alert(`Error al registrar vehículo: ${error.message}`);
    }
  };

  const loadUserVehicles = async () => {
    try {
      const response = await httpService.get(API_ENDPOINTS.VEHICLE_GET_ALL);

      const vehiclesData = response.map(v => ({
        id: v.vehicleId,
        plate: v.plate,
        vin: v.vin,
        brand: v.Make,
          model: v.model,
        year: v.modelYear,
        color: v.color,
        type: v.vehicleTypeCode,
        owner: v.currentHolderName || "Sin asignar",
        documents: []
      }));

      setVehicles(vehiclesData);

    } catch (error) {
      console.error("Error cargando vehículos:", error);
    }
  };

  /* =========================
     Scheduling & inspection
     ========================= */
  const scheduleInspection = async (s) => {
    try {
      const vehicle = vehicles.find(v => v.plate === s.vehiclePlate);

      const requestData = {
        vehicleId: vehicle?.id,
        workshopId: s.workshopId || talleres[0]?.id,
        inspectorUserId: s.inspectorId || null,
        templateId: s.templateId,
        scheduledAt: new Date(`${s.datetime}`).toISOString(),
        odometerKm: 0,
        comments: s.notes || ""
      };

      const response = await httpService.post(API_ENDPOINTS.INSPECTION_CREATE, requestData);

      const newSchedule = {
        id: response.inspectionId,
        vehicle: s.vehiclePlate,
        vehicleType: vehicle?.type || "AUTO",
        templateId: s.templateId,
        datetime: s.datetime,
        inspector: s.inspector,
        workshopId: s.workshopId,
        taller: s.taller,
        status: "Programada",
        notes: s.notes
      };

      setScheduled(prev => [newSchedule, ...prev]);
      alert("Inspección programada exitosamente");

    } catch (error) {
      alert(`Error al programar inspección: ${error.message}`);
    }
  };

  const addInspection = (ins) => {
    setInspections(prev => [ins, ...prev]);
  };

  const saveInspectionProgress = async ({ inspectionId, items }) => {
    try {
      const itemsToUpdate = items.filter(item => 
        item.status !== "No aplica" && item.status !== ""
      );

      if (itemsToUpdate.length === 0) {
        alert("No hay items para guardar");
        return;
      }

      const batchRequest = {
        items: itemsToUpdate.map(item => ({
          itemId: item.code,
          valueBoolean: item.valueBoolean,
          valueNumeric: item.valueNumeric ? parseFloat(item.valueNumeric) : null,
          valueEnum: item.valueEnum || null,
          valueText: item.comment || null,
          passFail: item.status === "Aprobado" ? "PASS" :
            item.status === "Falla" ? "FAIL" : null,
          evidenceUrl: item.photos.length > 0 ? item.photos[0].data : null
        }))
      };

      await httpService.put(
        API_ENDPOINTS.INSPECTION_BATCH_UPDATE_ITEMS(inspectionId),
        batchRequest
      );

      const scheduledItem = scheduled.find(s => s.id === inspectionId);
      const progressInspection = {
        id: `progress_${inspectionId}`,
        vehicle: scheduledItem?.vehicle || "Desconocido",
        date: nowDate(),
        result: "En progreso",
        inspector: scheduledItem?.inspector || "N/A",
        taller: scheduledItem?.taller || "N/A",
        items
      };

      setInspections(prev => {
        const filtered = prev.filter(i => i.id !== progressInspection.id);
        return [progressInspection, ...filtered];
      });

      setNotifications(prev => [
        {
          id: `n${Date.now()}`,
          title: "Progreso guardado",
          message: `Se han guardado ${itemsToUpdate.length} items de la inspección`,
          status: "Entregado"
        },
        ...prev
      ]);

      alert(`✓ Progreso guardado\n${itemsToUpdate.length} items actualizados`);

    } catch (error) {
      console.error("Error guardando progreso:", error);
      alert(`Error guardando progreso: ${error.message}`);
    }
  };

  const finishInspectionFlow = async (inspectionWithItems) => {
    try {
      // 1. Actualizar items en batch
      const itemsToUpdate = inspectionWithItems.items.filter(item => 
        item.status !== "No aplica" && item.status !== ""
      );

      if (itemsToUpdate.length > 0) {
        const batchRequest = {
          items: itemsToUpdate.map(item => ({
            itemId: item.code,
            valueBoolean: item.valueBoolean,
            valueNumeric: item.valueNumeric ? parseFloat(item.valueNumeric) : null,
            valueEnum: item.valueEnum || null,
            valueText: item.comment || null,
            passFail: item.status === "Aprobado" ? "PASS" :
              item.status === "Falla" ? "FAIL" : null,
            evidenceUrl: item.photos.length > 0 ? item.photos[0].data : null
          }))
        };

        await httpService.put(
          API_ENDPOINTS.INSPECTION_BATCH_UPDATE_ITEMS(inspectionWithItems.id),
          batchRequest
        );
      }

      // 2. Agregar defectos
      const defects = inspectionWithItems.items
        .filter(item => item.status === "Falla" && item.defectSeverity)
        .map(item => ({
          itemId: item.code,
          severity: item.defectSeverity,
          description: item.defectDescription || `Defecto en ${item.name}`,
          correctiveDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }));

      for (const defect of defects) {
        try {
          await httpService.post(
            API_ENDPOINTS.INSPECTION_ADD_DEFECT(inspectionWithItems.id),
            defect
          );
        } catch (defectError) {
          console.error(`Error registrando defecto:`, defectError);
        }
      }

      // 3. Completar inspección
      const completeResponse = await httpService.post(
        API_ENDPOINTS.INSPECTION_COMPLETE(inspectionWithItems.id),
        {
          finalComments: `Inspección completada. ${defects.length} defecto(s) encontrado(s).`
        }
      );

      // 4. Mapear resultado
      const resultMap = {
        "APPROVED": "Aprobado",
        "REJECTED": "Rechazado",
        "CONDITIONAL": "Condicional"
      };

      const newInspection = {
        id: inspectionWithItems.id,
        vehicle: inspectionWithItems.vehicle,
        vehicleType: inspectionWithItems.vehicleType,
        date: nowDate(),
        result: resultMap[completeResponse.overallResult] || "Aprobado",
        inspector: inspectionWithItems.inspector,
        taller: inspectionWithItems.taller,
        workshopId: inspectionWithItems.workshopId,
        items: inspectionWithItems.items
      };

      addInspection(newInspection);

      // 5. Si aprobó, solicitar certificado
      if (newInspection.result === "Aprobado") {
        try {
          await requestCertificate(inspectionWithItems.id);

          setNotifications(prev => [
            {
              id: `n${Date.now()}`,
              title: "Certificado en proceso",
              message: `El certificado para ${newInspection.vehicle} está siendo generado`,
              status: "Entregado"
            },
            ...prev
          ]);
        } catch (certError) {
          console.error("Error solicitando certificado:", certError);
          alert("Inspección aprobada pero hubo un error al solicitar el certificado.");
        }
      } else if (newInspection.result === "Condicional") {
        setNotifications(prev => [
          {
            id: `n${Date.now()}`,
            title: "Inspección condicional",
            message: `La inspección de ${newInspection.vehicle} tiene defectos que deben corregirse en 30 días`,
            status: "Entregado"
          },
          ...prev
        ]);
      } else {
        setNotifications(prev => [
          {
            id: `n${Date.now()}`,
            title: "Inspección no aprobada",
            message: `La inspección de ${newInspection.vehicle} requiere reparaciones críticas`,
            status: "Entregado"
          },
          ...prev
        ]);
      }

      setExecInspection(null);
      setPage("inspections");

      alert(`✓ Inspección completada\nResultado: ${newInspection.result}\nDefectos: ${defects.length}`);

    } catch (error) {
      console.error("Error al finalizar inspección:", error);
      alert(`Error al finalizar inspección: ${error.message}`);
    }
  };

  const requestCertificate = async (inspectionId) => {
    try {
      const response = await httpService.post(API_ENDPOINTS.CERTIFICATE_REQUEST, {
        inspectionId: inspectionId,
        provider: "DGII"
      });

      return response.certificateId;

    } catch (error) {
      console.error("Error solicitando certificado:", error);
      throw error;
    }
  };

  const loadCertificates = async () => {
    try {
      const response = await httpService.get(API_ENDPOINTS.CERTIFICATE_GET_ALL);

      const certsData = response.map(c => ({
        id: c.certificateId,
        vehicle: c.vehiclePlate || "N/A",
        date: c.issueDate?.split('T')[0],
        status: c.status === "VALID" ? "Activo" : c.status === "REVOKED" ? "Revocado" : "Expirado",
        details: c.comments || "Certificado de inspección técnica vehicular",
        expiryDate: c.expiryDate?.split('T')[0],
        qrHash: c.qrHash
      }));

      setCertificates(certsData);

    } catch (error) {
      console.error("Error cargando certificados:", error);
    }
  };

  /* =========================
     Notifications handlers
     ========================= */
  const retryNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "Entregado" } : n));
  };

  /* =========================
     Certificate selection
     ========================= */
  const selectCertificate = (c) => {
    setSelectedCert(c);
    setViewCertDetail(false);
  };
  
  const openCertDetail = () => setViewCertDetail(true);
  const closeCertDetail = () => setViewCertDetail(false);

  /* =========================
     History filtering
     ========================= */
  const [historyFilter, setHistoryFilter] = useState({ q: "", from: "", to: "" });
  const filteredInspections = inspections.filter(i => {
    const matchesQ = !historyFilter.q || (i.vehicle || "").includes(historyFilter.q) || (i.id || "").includes(historyFilter.q);
    const date = i.date || "";
    const matchesFrom = !historyFilter.from || date >= historyFilter.from;
    const matchesTo = !historyFilter.to || date <= historyFilter.to;
    return matchesQ && matchesFrom && matchesTo;
  });

  /* =========================
     Export functions
     ========================= */
  const exportInspectionsCSV = () => downloadCSV("inspections.csv", inspections.map(i => ({ id: i.id, vehicle: i.vehicle, date: i.date, result: i.result })));
  const exportCertificatesCSV = () => downloadCSV("certificates.csv", certificates.map(c => ({ id: c.id, vehicle: c.vehicle, date: c.date, status: c.status })));

  /* =========================
     Portal selection initial screen
     ========================= */
  if (!portal) {
    return <PortalSelect onSelect={(p) => { setPortal(p); setRole(null); setPage("login"); }} />;
  }

  /* =========================
     If not logged in -> show auth pages (login/register)
     ========================= */
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grayBg }}>
        <TopMenu loggedIn={loggedIn} onToggleLogin={() => { setLoggedIn(true); }} goPortal={(p)=>{ if (p==='home') setPortal(null); }} />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
            <div>
              <Login onLogin={(creds) => handleLogin(creds)} onForgot={() => alert("Funcionalidad de recuperación de contraseña estará disponible próximamente")} />
            </div>
            <div>
              <Register portal={portal} onRegister={(payload)=>handleRegister(payload)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Main logged-in layout
     ========================= */
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grayBg }}>
      <TopMenu loggedIn={loggedIn} onToggleLogin={handleLogout} goPortal={(p)=>{ if (p==='home') { setPortal(null); setLoggedIn(false); } }} />
      <div className="flex flex-1">
        <Sidebar role={role || (loggedUser?.role ?? portal)} page={page} setPage={setPage} username={loggedUser?.fullName || "Usuario"} />
        <main className="flex-1 p-6 overflow-auto">
          {/* Dashboard */}
          {page === "dashboard" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>Panel de Control</h1>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-600">Inspecciones totales</div>
                  <div className="text-2xl font-bold">{inspections.length}</div>
                  <div className="text-xs text-green-600">↗ +12% este mes</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-600">Certificados activos</div>
                  <div className="text-2xl font-bold">{certificates.filter(c => c.status === "Activo").length}</div>
                  <div className="text-xs text-blue-600">• Vigentes</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-600">Vehículos registrados</div>
                  <div className="text-2xl font-bold">{vehicles.length}</div>
                  <div className="text-xs text-gray-500">En el sistema</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-600">Inspecciones programadas</div>
                  <div className="text-2xl font-bold">{scheduled.filter(s => s.status === "Programada").length}</div>
                  <div className="text-xs text-orange-600">• Próximas</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Resumen de resultados</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={[
                        { name: "Aprobadas", value: inspections.filter(i=>i.result==="Aprobado").length },
                        { name: "Rechazadas", value: inspections.filter(i=>i.result==="Rechazado").length },
                        { name: "En proceso", value: inspections.filter(i=>i.result==="En progreso").length },
                      ]} dataKey="value" nameKey="name" outerRadius={80}>
                        <Cell fill={COLORS.intrantGreen} />
                        <Cell fill="#FF4444" />
                        <Cell fill={COLORS.intrantOrange} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Actividad reciente</h3>
                  <div className="space-y-2">
                    {inspections.slice(0, 5).map((ins, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <div className="font-medium text-sm">{ins.vehicle}</div>
                          <div className="text-xs text-gray-500">{ins.date}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${ins.result === 'Aprobado' ? 'bg-green-100 text-green-800' : ins.result === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                          {ins.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles */}
          {page === "vehicles" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>Gestión de Vehículos</h1>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Vehículos registrados</h3>
                      <div className="text-sm text-gray-500">{vehicles.length} total</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#FFF4E5] sticky top-0">
                          <tr>
                            <th className="p-2">Placa</th>
                            <th className="p-2">VIN</th>
                            <th className="p-2">Marca/Modelo</th>
                            <th className="p-2">Año</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Color</th>
                            <th className="p-2">Combustible</th>
                            <th className="p-2">KM</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Titular</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicles.map(v => (
                            <tr key={v.id} className="border-t hover:bg-gray-50 cursor-pointer">
                              <td className="p-2 font-bold" style={{ color: COLORS.intrantBlue }}>{v.plate}</td>
                              <td className="p-2 text-xs text-gray-600">{v.vin || "N/A"}</td>
                              <td className="p-2">{v.brand} {v.model}</td>
                              <td className="p-2">{v.year}</td>
                              <td className="p-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {v.type === "AUTO" ? "Automóvil" : 
                                   v.type === "MOTO" ? "Moto" : 
                                   v.type === "CAMION" ? "Camión" : 
                                   v.type === "BUS" ? "Bus" : "Van"}
                                </span>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-5 h-5 rounded-full border border-gray-300" 
                                    style={{ 
                                      backgroundColor: 
                                        v.color === "Blanco" ? "#F5F5F5" : 
                                        v.color === "Negro" ? "#000" : 
                                        v.color === "Gris" ? "#999" : 
                                        v.color === "Rojo" ? "#FF0000" : 
                                        v.color === "Azul" ? "#0000FF" : 
                                        v.color === "Verde" ? "#00AA00" : 
                                        v.color === "Amarillo" ? "#FFFF00" : 
                                        v.color === "Naranja" ? "#FFA500" :
                                        v.color === "Marrón" ? "#8B4513" :
                                        v.color === "Plateado" ? "#C0C0C0" :
                                        v.color === "Dorado" ? "#FFD700" :
                                        v.color === "Beige" ? "#F5F5DC" : "#CCC"
                                    }}
                                  />
                                  <span className="text-xs">{v.color || "N/A"}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  {v.fuel || "N/A"}
                                </span>
                              </td>
                              <td className="p-2 text-right text-xs">
                                {(v.mileage || 0).toLocaleString()} km
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  v.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                                  v.status === "INACTIVE" ? "bg-gray-100 text-gray-800" :
                                  v.status === "STOLEN" ? "bg-red-100 text-red-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {v.status === "ACTIVE" ? "Activo" :
                                   v.status === "INACTIVE" ? "Inactivo" :
                                   v.status === "STOLEN" ? "Robado" : "Decomisado"}
                                </span>
                              </td>
                              <td className="p-2 text-xs">{v.owner || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <VehicleRegister owners={users.filter(u=>u.role==="Titular")} onAdd={addVehicle} />
                </div>
              </div>
            </div>
          )}

          {/* Inspections: schedule + execute */}
          {page === "inspections" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Gestión de Inspecciones</h1>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="bg-white p-4 rounded shadow mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Inspecciones programadas</h3>
                      <div className="text-sm text-gray-500">{scheduled.length} programadas</div>
                    </div>
                    <table className="w-full text-left mt-2">
                      <thead className="bg-[#FFF4E5]">
                        <tr><th className="p-2">Vehículo</th><th className="p-2">Tipo</th><th className="p-2">Fecha/Hora</th><th className="p-2">Inspector</th><th className="p-2">Estado</th><th className="p-2">Acciones</th></tr>
                      </thead>
                      <tbody>
                        {scheduled
                          .filter(s => (role === "Inspector" || role === "Supervisor") ? s.workshopId === loggedUser?.workshopId : true)
                          .map(s => (
                          <tr key={s.id} className="border-t">
                            <td className="p-2 font-medium">{s.vehicle}</td>
                            <td className="p-2">{s.vehicleType}</td>
                            <td className="p-2">{s.datetime}</td>
                            <td className="p-2">{s.inspector}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${s.status === 'Programada' ? 'bg-blue-100 text-blue-800' : s.status === 'En proceso' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="p-2">
                              <button 
                                onClick={() => setExecInspection({ 
                                  id: s.id, 
                                  vehicle: s.vehicle, 
                                  vehicleType: s.vehicleType,
                                  inspector: s.inspector, 
                                  taller: s.taller,
                                  workshopId: s.workshopId
                                })} 
                                className="px-2 py-1 rounded border text-sm hover:bg-gray-50"
                                disabled={s.status === "En proceso"}
                              >
                                {s.status === "En proceso" ? "En curso" : "Iniciar"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Historial de inspecciones</h3>
                      <div className="text-sm text-gray-500">{inspections.length} completadas</div>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-[#FFF4E5]"><tr><th className="p-2">ID</th><th className="p-2">Vehículo</th><th className="p-2">Fecha</th><th className="p-2">Inspector</th><th className="p-2">Resultado</th></tr></thead>
                      <tbody>
                        {inspections
                          .filter(i => (role === "Inspector" || role === "Supervisor") ? i.workshopId === loggedUser?.workshopId : true)
                          .slice(0, 8)
                          .map(it=>(
                          <tr key={it.id} className="border-t">
                            <td className="p-2 text-sm text-gray-600">{it.id}</td>
                            <td className="p-2 font-medium">{it.vehicle}</td>
                            <td className="p-2">{it.date}</td>
                            <td className="p-2">{it.inspector}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${it.result === 'Aprobado' ? 'bg-green-100 text-green-800' : it.result === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                {it.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <ScheduleInspection 
                    vehicles={vehicles} 
                    inspectors={inspectors} 
                    talleres={talleres} 
                    onSchedule={scheduleInspection}
                    userRole={role}
                    userWorkshopId={loggedUser?.workshopId}
                  />
                </div>
              </div>

              {/* Execution area */}
              {execInspection && (
                <div className="mt-6">
                  <ExecuteInspection
                    inspection={execInspection}
                    onSaveProgress={(data)=>saveInspectionProgress(data)}
                    onFinish={(data)=>finishInspectionFlow(data)}
                    onCancel={(id)=>{ setExecInspection(null); }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Inspectors list */}
          {page === "inspectors" && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Inspectores Certificados</h1>
              <div className="bg-white p-4 rounded shadow">
                <div className="grid gap-4">
                  {inspectors.map(ins => (
                    <div key={ins.id} className="p-4 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg">{ins.name}</div>
                          <div className="text-sm text-gray-600">{ins.role}</div>
                          <div className="text-sm text-blue-600">{ins.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Certificación</div>
                          <div className="text-sm text-gray-600">{ins.certification}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Activo</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Certificado</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certificates */}
          {page === "certificates" && (
            <div>
              <CertificatesView certificates={certificates} onSelect={(c)=>{ selectCertificate(c); openCertDetail(); }} selected={selectedCert} viewDetail={viewCertDetail} onCloseDetail={() => setViewCertDetail(false)} />
              <div className="mt-4">
                <button onClick={() => exportCertificatesCSV()} className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>
                  <Download className="w-4 h-4 inline mr-2" />
                  Exportar certificados
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {page === "notifications" && (
            <NotificationsView notifications={notifications} onRetry={retryNotification} />
          )}

          {/* Admin */}
          {page === "admin" && (
            <AdminPanel users={users} setUsers={setUsers} talleres={talleres} setTalleres={setTalleres} />
          )}

          {/* Supervisor */}
          {page === "supervisor" && (
            <SupervisorPanel users={users} setUsers={setUsers} talleres={talleres} userWorkshopId={loggedUser?.workshopId} />
          )}

          {/* Reports */}
          {page === "reports" && (
            <ReportsView inspections={inspections} certificates={certificates} />
          )}

          {/* History / filters */}
          {page === "history" && (
            <div>
              <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Historial completo de inspecciones</h2>
              <div className="bg-white p-4 rounded shadow mt-3">
                <div className="flex gap-2 mb-3">
                  <input placeholder="Buscar por placa o ID" value={historyFilter.q} onChange={(e)=>setHistoryFilter({...historyFilter, q:e.target.value})} className="border p-2 rounded flex-1" />
                  <input type="date" value={historyFilter.from} onChange={(e)=>setHistoryFilter({...historyFilter, from:e.target.value})} className="border p-2 rounded" />
                  <input type="date" value={historyFilter.to} onChange={(e)=>setHistoryFilter({...historyFilter, to:e.target.value})} className="border p-2 rounded" />
                  <button onClick={()=>exportInspectionsCSV()} className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>
                    <Download className="w-4 h-4 inline mr-2" />
                    Exportar
                  </button>
                </div>

                <table className="w-full text-left">
                  <thead className="bg-[#FFF4E5]"><tr><th className="p-2">ID</th><th className="p-2">Vehículo</th><th className="p-2">Fecha</th><th className="p-2">Inspector</th><th className="p-2">Taller</th><th className="p-2">Resultado</th></tr></thead>
                  <tbody>
                    {filteredInspections.map(it=>(
                      <tr key={it.id} className="border-t">
                        <td className="p-2 text-sm text-gray-600">{it.id}</td>
                        <td className="p-2 font-medium">{it.vehicle}</td>
                        <td className="p-2">{it.date}</td>
                        <td className="p-2">{it.inspector}</td>
                        <td className="p-2">{it.taller}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${it.result === 'Aprobado' ? 'bg-green-100 text-green-800' : it.result === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                            {it.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}