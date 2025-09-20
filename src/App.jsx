import React, { useState } from "react";
import {
  Car,
  FileCheck,
  LogOut,
  Users,
  BarChart2,
  Bell,
  Settings,
  Home,
  Info,
  Briefcase,
  Phone,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Paleta INTRANT
const COLORS = {
  intrantBlue: "#003D73",
  intrantOrange: "#FF6A13",
  intrantGreen: "#009639",
  white: "#FFFFFF",
  grayBg: "#F5F5F5",
  pie: ["#009639", "#FF6A13"],
};

// -------- HEADER SUPERIOR --------
function TopMenu({ isLoggedIn, onLoginToggle }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 shadow-sm"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Navegación izquierda */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <button className="flex items-center gap-1 text-gray-700 hover:text-[#FF6A13]">
          <Home className="w-4 h-4" /> Inicio
        </button>
        <button className="flex items-center gap-1 text-gray-700 hover:text-[#FF6A13]">
          <Info className="w-4 h-4" /> Sobre Nosotros
        </button>
        <button className="flex items-center gap-1 text-gray-700 hover:text-[#FF6A13]">
          <Briefcase className="w-4 h-4" /> Servicios
        </button>
        <button className="flex items-center gap-1 text-gray-700 hover:text-[#FF6A13]">
          <Phone className="w-4 h-4" /> Contacto
        </button>
      </nav>

      {/* Opciones derecha */}
      <div className="flex items-center gap-4">
        <button
          onClick={onLoginToggle}
          className="px-3 py-1 rounded-md text-sm"
          style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
        >
          {isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Bell className="w-5 h-5" style={{ color: COLORS.intrantBlue }} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Settings className="w-5 h-5" style={{ color: COLORS.intrantBlue }} />
        </button>
      </div>
    </header>
  );
}

// -------- SIDEBAR --------
function Sidebar({ page, setPage, username }) {
  const MenuButton = ({ Icon, label, target }) => (
    <button
      onClick={() => setPage(target)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left hover:bg-gray-50 transition`}
      style={{
        color: page === target ? COLORS.intrantOrange : COLORS.intrantBlue,
        fontWeight: page === target ? 700 : 500,
      }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-64 p-4 border-r" style={{ backgroundColor: COLORS.white }}>
      {/* Logo y usuario */}
      <div className="mb-6">
        <div
          className="w-20 h-20 mb-2 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white, fontWeight: 700 }}
        >
          LOGO
        </div>
        <p className="text-center font-medium" style={{ color: COLORS.intrantBlue }}>
          {username}
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        <MenuButton Icon={BarChart2} label="Dashboard" target="dashboard" />
        <MenuButton Icon={Car} label="Vehículos" target="vehicles" />
        <MenuButton Icon={FileCheck} label="Inspecciones" target="inspections" />
        <MenuButton Icon={Users} label="Inspectores" target="inspectors" />
        <MenuButton Icon={FileCheck} label="Certificados" target="certificates" />
        <MenuButton Icon={Bell} label="Notificaciones" target="notifications" />
        <MenuButton Icon={Settings} label="Admin Taller" target="admin" />
      </nav>
    </aside>
  );
}

// -------- LOGIN & REGISTER --------
function LoginPage({ onLogin, onRegister }) {
  return (
    <div className="flex justify-center items-center h-full">
      <form className="p-6 rounded-2xl shadow-md w-96 space-y-4" style={{ backgroundColor: COLORS.white }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
          Iniciar Sesión
        </h2>
        <input type="text" placeholder="Usuario" className="w-full border p-2 rounded-xl" />
        <input type="password" placeholder="Contraseña" className="w-full border p-2 rounded-xl" />
        <button
          type="button"
          onClick={onLogin}
          className="w-full py-2 rounded-xl"
          style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={onRegister}
          className="w-full py-2 rounded-xl border border-gray-300"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

function RegisterPage({ onBack }) {
  return (
    <div className="flex justify-center items-center h-full">
      <form className="p-6 rounded-2xl shadow-md w-[28rem] space-y-3" style={{ backgroundColor: COLORS.white }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
          Registro de Usuario
        </h2>
        <select className="w-full border p-2 rounded-xl">
          <option>Tipo de Usuario</option>
          <option>Personal</option>
          <option>Empresarial</option>
        </select>
        <div className="flex gap-2">
          <input type="text" placeholder="Nombre" className="w-1/2 border p-2 rounded-xl" />
          <input type="text" placeholder="Apellido" className="w-1/2 border p-2 rounded-xl" />
        </div>
        <input type="text" placeholder="Cédula" className="w-full border p-2 rounded-xl" />
        <input type="text" placeholder="Dirección" className="w-full border p-2 rounded-xl" />
        <input type="email" placeholder="Correo" className="w-full border p-2 rounded-xl" />
        <input type="text" placeholder="Municipio" className="w-full border p-2 rounded-xl" />
        <input type="tel" placeholder="Teléfono" className="w-full border p-2 rounded-xl" />
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 rounded-xl"
          style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

// -------- DASHBOARD --------
function Dashboard({ inspections }) {
  // Datos para PieChart (Aprobado vs Rechazado)
  const pieData = [
    { name: "Aprobado", value: inspections.filter(i => i.result === "Aprobado").length },
    { name: "Rechazado", value: inspections.filter(i => i.result === "Rechazado").length },
  ];

  // Datos para BarChart (inspecciones por fecha)
  const barData = inspections.reduce((acc, curr) => {
    const day = curr.date;
    const found = acc.find(d => d.date === day);
    if (found) {
      found.Aprobado += curr.result === "Aprobado" ? 1 : 0;
      found.Rechazado += curr.result === "Rechazado" ? 1 : 0;
    } else {
      acc.push({
        date: day,
        Aprobado: curr.result === "Aprobado" ? 1 : 0,
        Rechazado: curr.result === "Rechazado" ? 1 : 0,
      });
    }
    return acc;
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
        Dashboard del Taller
      </h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <p>Inspecciones Hoy</p>
          <p className="text-2xl font-bold">{inspections.length}</p>
        </div>
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <p>Aprobados</p>
          <p className="text-2xl font-bold text-green-600">
            {inspections.filter(i => i.result === "Aprobado").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <p>Rechazados</p>
          <p className="text-2xl font-bold text-red-600">
            {inspections.filter(i => i.result === "Rechazado").length}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <h3 className="font-semibold mb-2">Resultado de Inspecciones</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pie[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <h3 className="font-semibold mb-2">Inspecciones por Fecha</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Aprobado" fill={COLORS.intrantGreen} />
              <Bar dataKey="Rechazado" fill={COLORS.intrantOrange} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// -------- VEHÍCULOS --------
function Vehicles({ vehicles, addVehicle, inspections }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicleInspections = inspections.filter((i) => i.vehicle === selectedVehicle?.plate);
  const pieData = [
    { name: "Aprobado", value: vehicleInspections.filter((i) => i.result === "Aprobado").length },
    { name: "Rechazado", value: vehicleInspections.filter((i) => i.result === "Rechazado").length },
  ];

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
          Vehículos
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-2 rounded mb-4"
          style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
        >
          Agregar Vehículo
        </button>
        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addVehicle({
                id: Date.now(),
                plate: e.target.plate.value,
                brand: e.target.brand.value,
                model: e.target.model.value,
                year: e.target.year.value,
                color: e.target.color.value,
                fuel: e.target.fuel.value,
              });
              setShowForm(false);
            }}
            className="p-4 rounded-2xl shadow mb-4 space-y-2"
            style={{ backgroundColor: COLORS.white }}
          >
            <input name="plate" placeholder="Placa" className="w-full border p-2 rounded" />
            <input name="brand" placeholder="Marca" className="w-full border p-2 rounded" />
            <input name="model" placeholder="Modelo" className="w-full border p-2 rounded" />
            <input name="year" placeholder="Año" className="w-full border p-2 rounded" />
            <input name="color" placeholder="Color" className="w-full border p-2 rounded" />
            <select name="fuel" className="w-full border p-2 rounded">
              <option>Gasolina</option>
              <option>Eléctrico</option>
              <option>Diésel</option>
              <option>Otro</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 rounded"
              style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
            >
              Guardar
            </button>
          </form>
        )}
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <table className="w-full text-left">
            <thead className="bg-[#FFF4E5]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Placa</th>
                <th className="p-3">Marca</th>
                <th className="p-3">Modelo</th>
                <th className="p-3">Año</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedVehicle(v)}
                >
                  <td className="p-3">{v.id}</td>
                  <td className="p-3">{v.plate}</td>
                  <td className="p-3">{v.brand}</td>
                  <td className="p-3">{v.model}</td>
                  <td className="p-3">{v.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
        <aside className="w-80 p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <h3 className="font-semibold mb-2">Vehículo {selectedVehicle.plate}</h3>
          <p><b>Marca:</b> {selectedVehicle.brand}</p>
          <p><b>Modelo:</b> {selectedVehicle.model}</p>
          <p><b>Año:</b> {selectedVehicle.year}</p>
          <p><b>Color:</b> {selectedVehicle.color}</p>
          <p><b>Combustible:</b> {selectedVehicle.fuel}</p>
          <h4 className="mt-4 mb-2 font-semibold">Resumen de Inspecciones</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pie[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </aside>
      )}
    </div>
  );
}

// -------- INSPECCIONES --------
function Inspections({ onFinishInspection, inspections, inspectors, talleres }) {
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>
            Crear Nueva Inspección
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border">Cancelar</button>
            <button className="px-3 py-1 rounded border">Guardar Progreso</button>
            <button
              onClick={() => onFinishInspection()}
              className="px-3 py-1 rounded"
              style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
            >
              Terminar Inspección
            </button>
          </div>
        </div>
        <form className="p-4 rounded-2xl shadow space-y-2" style={{ backgroundColor: COLORS.white }}>
          <input placeholder="ID Vehículo" className="w-full border p-2 rounded" />
          <select className="w-full border p-2 rounded">
            {inspectors.map((i) => (
              <option key={i.id}>{i.name}</option>
            ))}
          </select>
          <select className="w-full border p-2 rounded">
            {talleres.map((t, idx) => (
              <option key={idx}>{t}</option>
            ))}
          </select>
          <input type="date" className="w-full border p-2 rounded" />
          <input type="number" placeholder="Kilometraje" className="w-full border p-2 rounded" />
          <select className="w-full border p-2 rounded">
            <option>Aprobado</option>
            <option>Rechazado</option>
          </select>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
        Inspecciones
      </h2>
      <button
        onClick={() => setCreating(true)}
        className="px-3 py-2 rounded mb-4"
        style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
      >
        Crear Nueva Inspección
      </button>
      <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
        <table className="w-full">
          <thead className="bg-[#FFF4E5]">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Vehículo</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.id}</td>
                <td className="p-3">{i.vehicle}</td>
                <td className="p-3">{i.date}</td>
                <td className="p-3">{i.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------- CERTIFICADOS --------
function Certificates({ certificates, viewMode, setViewMode, selectedCert, setSelectedCert }) {
  if (viewMode === "detail" && selectedCert) {
    return (
      <div className="relative p-6 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
        <button
          onClick={() => setViewMode("list")}
          className="absolute top-3 left-3 flex items-center gap-1 text-sm px-2 py-1 rounded"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
          Certificado #{selectedCert.id}
        </h2>
        <div className="flex gap-6">
          <div className="flex-1">
            <p><b>Vehículo:</b> {selectedCert.vehicle}</p>
            <p><b>Fecha:</b> {selectedCert.date}</p>
            <p><b>Estado:</b> {selectedCert.status}</p>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            QR
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
          Certificados
        </h2>
        <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <table className="w-full text-left">
            <thead className="bg-[#FFF4E5]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Vehículo</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCert(c)}
                >
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.vehicle}</td>
                  <td className="p-3">{c.date}</td>
                  <td className="p-3">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCert && viewMode === "list" && (
        <aside className="w-72 p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
          <h3 className="font-semibold mb-2">Certificado #{selectedCert.id}</h3>
          <p><b>Vehículo:</b> {selectedCert.vehicle}</p>
          <p><b>Fecha:</b> {selectedCert.date}</p>
          <p><b>Estado:</b> {selectedCert.status}</p>
          <div
            className="mt-3 flex items-center justify-center"
            style={{
              width: "100%",
              height: 100,
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            QR
          </div>
          <button
            onClick={() => setViewMode("detail")}
            className="flex items-center gap-2 mt-3 px-3 py-1 rounded"
            style={{ backgroundColor: COLORS.intrantOrange, color: COLORS.white }}
          >
            <MoreHorizontal className="w-4 h-4" /> Más
          </button>
        </aside>
      )}
    </div>
  );
}

// -------- INSPECTORES --------
function Inspectors({ inspectors }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
        Inspectores
      </h2>
      <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
        <ul>
          {inspectors.map((i) => (
            <li key={i.id} className="border-b py-2">{i.name} - {i.role}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// -------- NOTIFICACIONES --------
function Notifications({ notifications }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
        Notificaciones
      </h2>
      <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
        {notifications.map((n) => (
          <div key={n.id} className="border-b py-2 flex justify-between">
            <span>{n.message}</span>
            <span className="text-sm text-gray-500">{n.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------- ADMIN TALLER --------
function AdminTaller() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
        Administración del Taller
      </h2>
      <div className="p-4 rounded-2xl shadow" style={{ backgroundColor: COLORS.white }}>
        <p className="text-gray-600">Gestión de cuentas, permisos y configuración.</p>
      </div>
    </div>
  );
}

// -------- APP PRINCIPAL --------
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const [vehicles, setVehicles] = useState([
    { id: 1, plate: "A123456", brand: "Toyota", model: "Corolla", year: "2018", color: "Blanco", fuel: "Gasolina" },
    { id: 2, plate: "B987654", brand: "Honda", model: "Civic", year: "2019", color: "Negro", fuel: "Diésel" },
  ]);
  const [inspections, setInspections] = useState([
    { id: 1, vehicle: "A123456", date: "2025-09-01", result: "Aprobado" },
    { id: 2, vehicle: "A123456", date: "2025-09-10", result: "Rechazado" },
    { id: 3, vehicle: "B987654", date: "2025-09-03", result: "Aprobado" },
  ]);
  const [certificates, setCertificates] = useState([
    { id: 1, vehicle: "A123456", date: "2025-09-01", status: "Activo" },
  ]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [certViewMode, setCertViewMode] = useState("list");

  const [inspectors] = useState([
    { id: 1, name: "Juan Pérez", role: "Inspector Jefe" },
    { id: 2, name: "Ana Gómez", role: "Inspector" },
  ]);
  const [talleres] = useState(["Taller Los Robles", "Taller El Progreso", "Taller Autorizado Norte"]);
  const [notifications] = useState([
    { id: 1, message: "Certificado #1 generado", status: "Entregado" },
    { id: 2, message: "Inspección pendiente", status: "Pendiente" },
  ]);

  const handleFinishInspection = () => {
    const newCert = {
      id: certificates.length + 1,
      vehicle: "NuevoVehículo",
      date: new Date().toISOString().split("T")[0],
      status: "Activo",
    };
    setCertificates((prev) => [...prev, newCert]);
    setSelectedCert(newCert);
    setPage("certificates");
    setCertViewMode("detail");
  };

  const addVehicle = (vehicle) => setVehicles((prev) => [...prev, vehicle]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grayBg }}>
        <TopMenu isLoggedIn={isLoggedIn} onLoginToggle={() => setIsLoggedIn(true)} />
        <main className="flex-1 flex justify-center items-center">
          {!isRegistering ? (
            <LoginPage onLogin={() => setIsLoggedIn(true)} onRegister={() => setIsRegistering(true)} />
          ) : (
            <RegisterPage onBack={() => setIsRegistering(false)} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grayBg }}>
      <TopMenu isLoggedIn={isLoggedIn} onLoginToggle={() => setIsLoggedIn(false)} />
      <div className="flex flex-1">
        <Sidebar page={page} setPage={setPage} username="Taller Autorizado Los Robles" />
        <main className="flex-1 p-6">
          {page === "dashboard" && <Dashboard inspections={inspections} />}
          {page === "vehicles" && <Vehicles vehicles={vehicles} addVehicle={addVehicle} inspections={inspections} />}
          {page === "inspections" && (
            <Inspections
              inspections={inspections}
              onFinishInspection={handleFinishInspection}
              inspectors={inspectors}
              talleres={talleres}
            />
          )}
          {page === "certificates" && (
            <Certificates
              certificates={certificates}
              viewMode={certViewMode}
              setViewMode={setCertViewMode}
              selectedCert={selectedCert}
              setSelectedCert={setSelectedCert}
            />
          )}
          {page === "inspectors" && <Inspectors inspectors={inspectors} />}
          {page === "notifications" && <Notifications notifications={notifications} />}
          {page === "admin" && <AdminTaller />}
        </main>
      </div>
    </div>
  );
}
