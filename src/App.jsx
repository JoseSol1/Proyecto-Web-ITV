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

/* INSPECCIONES

*/

const VEHICLE_MODELS_BY_BRAND = {
    Toyota: [
        { id: 7, makeId: 1, makeName: 'Toyota', name: 'Prius', },
        { id: 6, makeId: 1, makeName: 'Toyota', name: 'Yaris', },
        { id: 5, makeId: 1, makeName: 'Toyota', name: 'Hilux', },
        { id: 4, makeId: 1, makeName: 'Toyota', name: 'Prado', },
        { id: 3, makeId: 1, makeName: 'Toyota', name: 'RAV4', },
        { id: 2, makeId: 1, makeName: 'Toyota', name: 'Camry', },
        { id: 1, makeId: 1, makeName: 'Toyota', name: 'Corolla', },
    ],
    Nissan: [
        { id: 14, makeId: 2, makeName: 'Nissan', name: 'Leaf', },
        { id: 13, makeId: 2, makeName: 'Nissan', name: 'Versa', },
        { id: 12, makeId: 2, makeName: 'Nissan', name: 'Frontier', },
        { id: 11, makeId: 2, makeName: 'Nissan', name: 'Pathfinder', },
        { id: 10, makeId: 2, makeName: 'Nissan', name: 'X-Trail', },
        { id: 9, makeId: 2, makeName: 'Nissan', name: 'Altima', },
        { id: 8, makeId: 2, makeName: 'Nissan', name: 'Sentra', },
    ],
    Honda: [
        { id: 20, makeId: 3, makeName: 'Honda', name: 'HR-V', },
        { id: 19, makeId: 3, makeName: 'Honda', name: 'Fit', },
        { id: 18, makeId: 3, makeName: 'Honda', name: 'Pilot', },
        { id: 17, makeId: 3, makeName: 'Honda', name: 'CR-V', },
        { id: 16, makeId: 3, makeName: 'Honda', name: 'Accord', },
        { id: 15, makeId: 3, makeName: 'Honda', name: 'Civic', },
    ],
    Hyundai: [
        { id: 26, makeId: 4, makeName: 'Hyundai', name: 'i10', },
        { id: 25, makeId: 4, makeName: 'Hyundai', name: 'Accent', },
        { id: 24, makeId: 4, makeName: 'Hyundai', name: 'Santa Fe', },
        { id: 23, makeId: 4, makeName: 'Hyundai', name: 'Tucson', },
        { id: 22, makeId: 4, makeName: 'Hyundai', name: 'Sonata', },
        { id: 21, makeId: 4, makeName: 'Hyundai', name: 'Elantra', },
    ],
    Kia: [
        { id: 32, makeId: 5, makeName: 'Kia', name: 'Soul', },
        { id: 31, makeId: 5, makeName: 'Kia', name: 'Picanto', },
        { id: 30, makeId: 5, makeName: 'Kia', name: 'Sorento', },
        { id: 29, makeId: 5, makeName: 'Kia', name: 'Sportage', },
        { id: 28, makeId: 5, makeName: 'Kia', name: 'Cerato', },
        { id: 27, makeId: 5, makeName: 'Kia', name: 'Rio', },
    ],
    Chevrolet: [
        { id: 42, makeId: 8, makeName: 'Chevrolet', name: 'Spark', },
        { id: 41, makeId: 8, makeName: 'Chevrolet', name: 'Silverado', },
        { id: 40, makeId: 8, makeName: 'Chevrolet', name: 'Captiva', },
        { id: 39, makeId: 8, makeName: 'Chevrolet', name: 'Cruze', },
        { id: 38, makeId: 8, makeName: 'Chevrolet', name: 'Aveo', },
    ],
    Ford: [
        { id: 47, makeId: 9, makeName: 'Ford', name: 'EcoSport', },
        { id: 46, makeId: 9, makeName: 'Ford', name: 'F-150', },
        { id: 45, makeId: 9, makeName: 'Ford', name: 'Explorer', },
        { id: 44, makeId: 9, makeName: 'Ford', name: 'Fiesta', },
        { id: 43, makeId: 9, makeName: 'Ford', name: 'Focus', },
    ],
    Mitsubishi: [
        { id: 37, makeId: 6, makeName: 'Mitsubishi', name: 'Mirage', },
        { id: 36, makeId: 6, makeName: 'Mitsubishi', name: 'L200', },
        { id: 35, makeId: 6, makeName: 'Mitsubishi', name: 'Montero', },
        { id: 34, makeId: 6, makeName: 'Mitsubishi', name: 'Outlander', },
        { id: 33, makeId: 6, makeName: 'Mitsubishi', name: 'Lancer'},
    ],
};


/* =====================
   Plantillas de inspección por tipo de vehículo
   ===================== */
// Template real de la base de datos para vehículos AUTO
// Plantilla real de inspección ITV-1 (TypeId: 1 - AUTO)
// Basada en la resolución RES-001-2024
const INSPECTION_TEMPLATES = {
    AUTO: [
        // ALUMBRADO (ALU)
        {
            itemId: "0121ae53-9c2a-4265-bef0-d284491b9537",
            code: "ALU-01",
            name: "Luces bajas",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Funcionamiento e intensidad luces bajas"
        },
        {
            itemId: "37283a30-3b79-4aeb-9844-2bfc57e95904",
            code: "ALU-02",
            name: "Luces altas",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Funcionamiento e intensidad luces altas"
        },
        {
            itemId: "574a148d-5736-4bf7-9b97-bbdb713c0226",
            code: "ALU-03",
            name: "Luces direccionales",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Funcionamiento de intermitentes"
        },
        {
            itemId: "58ea2c83-b4ca-4dc5-85f1-40bdeb61b99c",
            code: "ALU-04",
            name: "Luces de freno",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Funcionamiento luces de stop"
        },
        {
            itemId: "77c48b77-2540-490e-852a-58d932f6ba8f",
            code: "ALU-05",
            name: "Luces de reversa",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "LEVE",
            description: "Funcionamiento luces de retroceso"
        },

        // DIRECCIÓN Y NEUMÁTICOS (DIR)
        {
            itemId: "4cf9fde8-ba9e-4313-afb3-0a03aed7205b",
            code: "DIR-01",
            name: "Juego en dirección",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "grados",
            minValue: 0,
            maxValue: 25,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Holgura máxima en el volante"
        },
        {
            itemId: "c8bc829f-d7fd-4c92-9e98-264dbec73bac",
            code: "DIR-02",
            name: "Alineación",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Verificación de alineación de ruedas"
        },
        {
            itemId: "732f6217-91bf-4866-aaf8-483f3802ec77",
            code: "DIR-03",
            name: "Estado de neumáticos",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "mm",
            minValue: 1.6,
            maxValue: 15,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Profundidad y estado general de neumáticos"
        },

        // DOCUMENTALES (DOC)
        {
            itemId: "a7748f07-e210-4b3b-ad7e-c2145145ac8b",
            code: "DOC-01",
            name: "Registro vehicular",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Verificación de documentos del vehículo"
        },
        {
            itemId: "431261a1-780d-4198-84aa-43fcf1b31642",
            code: "DOC-02",
            name: "Seguro vigente",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Verificación de póliza de seguro"
        },
        {
            itemId: "5dd34ed8-ab58-460c-86f3-8e5fe94e085c",
            code: "DOC-03",
            name: "Identificación VIN",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Verificación de número VIN"
        },

        // EMISIONES (EMI)
        {
            itemId: "1a4d900e-cc6a-42db-a2db-6c08e7eca9ce",
            code: "EMI-01",
            name: "CO en ralentí",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 0,
            maxValue: 3.5,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Monóxido de carbono en ralentí"
        },
        {
            itemId: "6660bc76-d4bf-4f7b-9f54-6a45d90f8b4f",
            code: "EMI-02",
            name: "HC en ralentí",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "ppm",
            minValue: 0,
            maxValue: 200,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Hidrocarburos en ralentí"
        },
        {
            itemId: "4d6e0920-ac23-47df-8172-4a94c53f62c4",
            code: "EMI-03",
            name: "CO en acelerado",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 0,
            maxValue: 2.5,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Monóxido de carbono acelerado"
        },
        {
            itemId: "49acd02c-4755-4625-beb9-74e3f64b36a8",
            code: "EMI-04",
            name: "Opacidad diesel",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "m-1",
            minValue: 0,
            maxValue: 2.5,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Medición de humo en motores diesel"
        },

        // FRENOS (FRE)
        {
            itemId: "59dae52f-93fc-4340-ba4b-3122bb30ec3d",
            code: "FRE-01",
            name: "Eficiencia freno delantero",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 50,
            maxValue: 100,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Medición de eficiencia del sistema de frenos delanteros"
        },
        {
            itemId: "cd61a966-2a43-4c40-a262-5d92b80cb9f4",
            code: "FRE-02",
            name: "Eficiencia freno trasero",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 40,
            maxValue: 100,
            allowedValues: null,
            severityIfFail: "CRITICA",
            description: "Medición de eficiencia del sistema de frenos traseros"
        },
        {
            itemId: "ef54b486-86ac-4427-a50d-79f69ea32544",
            code: "FRE-03",
            name: "Equilibrio de frenado",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: -30,
            maxValue: 30,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Balance entre frenos izquierdo y derecho"
        },
        {
            itemId: "2344d2bb-58b3-4b05-b6fd-6dad42d3f8e9",
            code: "FRE-04",
            name: "Freno de estacionamiento",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            unit: null,
            minValue: null,
            maxValue: null,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Funcionamiento del freno de mano"
        },

        // RUIDO (RUI)
        {
            itemId: "2a888ae3-331c-4471-a141-a1ad5c9390b5",
            code: "RUI-01",
            name: "Nivel de ruido",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "dB",
            minValue: 0,
            maxValue: 95,
            allowedValues: null,
            severityIfFail: "LEVE",
            description: "Medición de ruido exterior"
        },

        // SUSPENSIÓN (SUS)
        {
            itemId: "e84a88d0-24f6-48ba-9999-89b51eeaa5eb",
            code: "SUS-01",
            name: "Amortiguadores delanteros",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 40,
            maxValue: 100,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Eficiencia de amortiguadores delanteros"
        },
        {
            itemId: "3788fb3c-3e28-4be9-a8c1-9e7bac953a7f",
            code: "SUS-02",
            name: "Amortiguadores traseros",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: 40,
            maxValue: 100,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Eficiencia de amortiguadores traseros"
        },
        {
            itemId: "15f803eb-9abb-47b5-99c5-ff2ea9a7a59f",
            code: "SUS-03",
            name: "Diferencia lateral suspension",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "%",
            minValue: -40,
            maxValue: 40,
            allowedValues: null,
            severityIfFail: "GRAVE",
            description: "Diferencia entre lados izquierdo y derecho"
        },
    ],

    // Mantén los otros tipos de vehículos
    MOTO: [
        {
            code: "SEG_M01",
            name: "Sistema de frenos",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar freno delantero y trasero"
        },
        {
            code: "SEG_M02",
            name: "Neumáticos",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "mm",
            minValue: 1.0,
            severityIfFail: "GRAVE",
            description: "Profundidad mínima de labrado"
        },
        {
            code: "SEG_M03",
            name: "Sistema de luces",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar faro, luz de freno e intermitentes"
        },
        {
            code: "SEG_M04",
            name: "Suspensión",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar horquilla y amortiguador"
        },
        {
            code: "SEG_M05",
            name: "Espejos",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "LEVE",
            description: "Verificar presencia y estado"
        },
        {
            code: "MED_M01",
            name: "Emisiones de gases",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "%",
            maxValue: 1.5,
            severityIfFail: "CRITICA",
            description: "Nivel de CO en emisiones"
        },
        {
            code: "MED_M02",
            name: "Sistema de escape",
            category: "MEDIOAMBIENTE",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar integridad y ruido"
        },
        {
            code: "DOC_M01",
            name: "Número de chasis",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar coincidencia con documentación"
        },
        {
            code: "DOC_M02",
            name: "Placa visible",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar legibilidad y fijación"
        },
    ],

    CAMION: [
        {
            code: "SEG_C01",
            name: "Sistema de frenos",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar sistema de frenos de servicio y estacionamiento"
        },
        {
            code: "SEG_C02",
            name: "Sistema de dirección",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar columna, caja y terminales con holguras"
        },
        {
            code: "SEG_C03",
            name: "Sistema de suspensión",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar ballestas, amortiguadores y bujes"
        },
        {
            code: "SEG_C04",
            name: "Neumáticos",
            category: "SEGURIDAD",
            resultType: "NUMERIC",
            unit: "mm",
            minValue: 2.0,
            severityIfFail: "CRITICA",
            description: "Profundidad mínima de labrado (mayor por carga)"
        },
        {
            code: "SEG_C05",
            name: "Sistema de luces",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar luces delanteras, traseras, laterales y de freno"
        },
        {
            code: "SEG_C06",
            name: "Triángulos y señales",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "LEVE",
            description: "Verificar presencia de equipo de seguridad"
        },
        {
            code: "SEG_C07",
            name: "Carrocería y carga",
            category: "SEGURIDAD",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar integridad y sistemas de sujeción"
        },
        {
            code: "MED_C01",
            name: "Emisiones de gases",
            category: "MEDIOAMBIENTE",
            resultType: "NUMERIC",
            unit: "%",
            maxValue: 2.0,
            severityIfFail: "CRITICA",
            description: "Nivel de opacidad en diésel"
        },
        {
            code: "MED_C02",
            name: "Fugas de fluidos",
            category: "MEDIOAMBIENTE",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar fugas de aceite, refrigerante o combustible"
        },
        {
            code: "MED_C03",
            name: "Sistema de escape",
            category: "MEDIOAMBIENTE",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar integridad y fugas"
        },
        {
            code: "DOC_C01",
            name: "Número de chasis",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar coincidencia con documentación"
        },
        {
            code: "DOC_C02",
            name: "Placa visible",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            severityIfFail: "CRITICA",
            description: "Verificar legibilidad y fijación"
        },
        {
            code: "DOC_C03",
            name: "Peso y dimensiones",
            category: "DOCUMENTAL",
            resultType: "BOOLEAN",
            severityIfFail: "GRAVE",
            description: "Verificar cumplimiento de límites legales"
        },
    ],
};

// Metadata del template ITV-1
const TEMPLATE_METADATA = {
    templateId: "a6eda317-b11e-4e7f-9d6f-e474a6087c29",
    templateName: "ITV-1",
    typeId: 1,
    version: 1,
    isActive: true,
    resolutionId: "6039db67-2acc-4715-9a68-d62ac5daf7eb",
    resolutionCode: "RES-001-2024",
    resolutionTitle: "Resolución General de ITV 2024"
};

;

const VEHICLE_TYPES = [
    { id: 1, code: "AUTO", label: "Automóvil" },
    { id: 2, code: "MOTO", label: "Motocicleta" },
    { id: 3, code: "CAMION", label: "Camión" },
    { id: 4, code: "BUS", label: "Autobús" },
    { id: 5, code: "VAN", label: "Camioneta" },
];
// Exportar para uso en tu aplicación
export { INSPECTION_TEMPLATES, TEMPLATE_METADATA, VEHICLE_TYPES }
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
   Modal Component (Reutilizable)
   ===================== */
function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b" style={{ backgroundColor: COLORS.intrantBlue }}>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =====================
   Sobre Nosotros Modal
   ===================== */
function AboutModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sobre APNITV" size="lg">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: "50%", background: COLORS.intrantOrange, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 800 }}>
            APNITV
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.intrantBlue }}>
            Automatización del Programa Nacional de Inspección Técnica Vehicular
          </h3>
          
          <p className="text-gray-700 leading-relaxed">
            Sistema desarrollado para automatizar el Programa Nacional de Inspección Técnica Vehicular 
            en República Dominicana, garantizando la seguridad vial y el cumplimiento de estándares 
            técnico-mecánicos y ambientales de los vehículos en circulación.
          </p>

          <h4 className="font-semibold mt-4" style={{ color: COLORS.intrantBlue }}>Nuestra Misión</h4>
          <p className="text-gray-700">
            Facilitar la inspección técnica vehicular mediante una plataforma digital eficiente y transparente, 
            contribuyendo a la reducción de accidentes de tránsito y emisiones contaminantes.
          </p>

          <h4 className="font-semibold mt-4" style={{ color: COLORS.intrantBlue }}>Nuestra Visión</h4>
          <p className="text-gray-700">
            Ser el sistema de referencia nacional para la gestión integral de inspecciones técnicas vehiculares, 
            reconocido por su transparencia, trazabilidad y modernización del parque vehicular.
          </p>

          <h4 className="font-semibold mt-4" style={{ color: COLORS.intrantBlue }}>Objetivos</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Optimizar procesos técnicos y administrativos</li>
            <li>Garantizar trazabilidad de la información</li>
            <li>Facilitar emisión de certificados digitales</li>
            <li>Reducir fallas mecánicas y accidentes</li>
            <li>Disminuir emisiones contaminantes</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

/* =====================
   Servicios Modal
   ===================== */
function ServicesModal({ isOpen, onClose }) {
  const services = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Inspección Técnica Vehicular (ITV)",
      description: "Verificación periódica del estado mecánico y de seguridad de los vehículos para garantizar su circulación segura."
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Registro de Vehículos",
      description: "Inscripción y actualización de datos de vehículos en el sistema nacional de tránsito."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Licencias de Conducir",
      description: "Emisión, renovación y gestión de licencias de conducir para todas las categorías vehiculares."
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "Consultas y Certificaciones",
      description: "Emisión de certificados de inspección, historiales vehiculares y consultas de multas."
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuestros Servicios" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <div key={idx} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div style={{ color: COLORS.intrantOrange }}>
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: COLORS.intrantBlue }}>
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Todos nuestros servicios están disponibles en nuestras oficinas regionales 
          y a través de nuestra plataforma digital.
        </p>
      </div>
    </Modal>
  );
}

/* =====================
   Contacto Modal
   ===================== */
function ContactModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contacto" size="md">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.intrantBlue }}>
            <Phone className="w-5 h-5" />
            Teléfonos
          </h3>
          <div className="space-y-2 ml-7">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Línea Principal:</span>
              <a href="tel:8091234567" className="font-medium hover:text-blue-600">809-565-7540</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Servicio al Cliente:</span>
              <a href="tel:8099876543" className="font-medium hover:text-blue-600">809-565-7541</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Emergencias:</span>
              <a href="tel:911" className="font-medium hover:text-blue-600">911</a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.intrantBlue }}>
            <Bell className="w-5 h-5" />
            Correos Electrónicos
          </h3>
          <div className="space-y-2 ml-7">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Información General:</span>
              <a href="mailto:info@intrant.gob.do" className="font-medium hover:text-blue-600 text-sm">
                info@itv.com.do
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Soporte Técnico:</span>
              <a href="mailto:soporte@intrant.gob.do" className="font-medium hover:text-blue-600 text-sm">
                soporte@itv.com.do
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quejas y Sugerencias:</span>
              <a href="mailto:quejas@intrant.gob.do" className="font-medium hover:text-blue-600 text-sm">
                quejas@itv.com.do
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.intrantBlue }}>
            <Home className="w-5 h-5" />
            Dirección
          </h3>
          <div className="ml-7">
            <p className="text-gray-700">
              Av. Gregorio Luperón esquina Av. Núñez de Cáceres<br />
              Ensanche La Fe, Santo Domingo<br />
              República Dominicana
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3" style={{ color: COLORS.intrantBlue }}>Horario de Atención</h3>
          <div className="ml-0">
            <p className="text-gray-700">
              Lunes a Viernes: 8:00 AM - 4:00 PM<br />
              Sábados: 8:00 AM - 12:00 PM
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* =====================
   Ajustes Modal
   ===================== */
function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: "es",
    autoSave: true
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración" size="md">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
            Notificaciones
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <span className="text-gray-700">Notificaciones push</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                className="w-5 h-5"
              />
            </label>
            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <span className="text-gray-700">Alertas por correo</span>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => setSettings({...settings, emailAlerts: e.target.checked})}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
            Apariencia
          </h3>
          <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
            <span className="text-gray-700">Modo oscuro</span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
            Preferencias
          </h3>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <label className="block text-gray-700 mb-2">Idioma</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <span className="text-gray-700">Autoguardado</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              alert("Configuración guardada");
              onClose();
            }}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: COLORS.intrantOrange }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* =====================
   Notificaciones Panel (Sidebar)
   ===================== */
function NotificationsPanel({ isOpen, onClose, notifications, onRetry }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div 
        className="bg-white w-96 shadow-2xl h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ backgroundColor: COLORS.intrantBlue }}>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificaciones
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3 border rounded hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{n.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${n.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {n.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  {n.status !== 'Entregado' && (
                    <button 
                      onClick={() => onRetry(n.id)}
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      Reintentar envío
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================
   Top menu component
   ===================== */
function TopMenu({ loggedIn, onToggleLogin, goPortal, onOpenAbout, onOpenServices, onOpenContact, onOpenNotifications, onOpenSettings }) {
  return (
    <header className="flex justify-between items-center p-4 shadow bg-white">
      <nav className="flex gap-4 items-center">
        <button onClick={() => goPortal("home")} className="flex items-center gap-1 text-sm hover:text-blue-600">
          <Home className="w-4 h-4" /> Inicio
        </button>
        <button onClick={onOpenAbout} className="flex items-center gap-1 text-sm hover:text-blue-600">
          <Info className="w-4 h-4" /> Sobre
        </button>
        <button onClick={onOpenServices} className="flex items-center gap-1 text-sm hover:text-blue-600">
          <Briefcase className="w-4 h-4" /> Servicios
        </button>
        <button onClick={onOpenContact} className="flex items-center gap-1 text-sm hover:text-blue-600">
          <Phone className="w-4 h-4" /> Contacto
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLogin}
          className="px-3 py-1 rounded text-sm hover:opacity-90"
          style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}
        >
          {loggedIn ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
        <button 
          onClick={onOpenNotifications}
          aria-label="alertas" 
          title="Alertas"
          className="hover:bg-gray-100 p-2 rounded"
        >
          <Bell className="w-5 h-5" color={COLORS.intrantBlue} />
        </button>
        <button 
          onClick={onOpenSettings}
          aria-label="ajustes" 
          title="Ajustes"
          className="hover:bg-gray-100 p-2 rounded"
        >
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

    const holderMenu = [
        { Icon: BarChart2, label: "Dashboard", target: "dashboard" },
        { Icon: Car, label: "Vehículos", target: "vehicles" },
        { Icon: FileCheck, label: "Certificados", target: "certificates" },
        { Icon: Bell, label: "Notificaciones", target: "notifications" },
    ];

    const workshopAndAdminCommon = [
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

    const getMenuItems = () => {
        if (role === "Titular") {
            return holderMenu;
        }

        let menu = [...workshopAndAdminCommon];

        if (role === "Administrador") {
            menu = [...menu, ...adminOnly];
        }

        if (role === "Supervisor") {
            menu = [...menu, ...supervisorOnly];
        }

        return menu;
    };

    const menuItems = getMenuItems();

    return (
        <aside className="w-72 p-4 border-r bg-white">
            <div className="text-center mb-6">
                <div style={{
                    width: 72,
                    height: 72,
                    margin: "0 auto",
                    borderRadius: 999,
                    background: COLORS.intrantOrange,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800
                }}>
                    LOGO
                </div>
                <div style={{ color: COLORS.intrantBlue, marginTop: 8 }}>{username}</div>
                <div className="text-xs text-gray-500 mt-1">{role}</div>
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map((m) => (
                    <MenuButton key={m.target} Icon={m.Icon} label={m.label} target={m.target} />
                ))}
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
function Login({ portal, onLogin, onForgot }) {
    const [creds, setCreds] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();

        if (!creds.email || !creds.password) {
            return setError("Completa correo y contraseña.");
        }

        setError("");
        setLoading(true);

        try {
            //Solo llama a handleLogin del padre
            await onLogin(creds);
        } catch (err) {
            //Solo maneja el error de UI
            setError(err.message || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.intrantBlue }}>Iniciar sesión - {portal}</h2>
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
        fuel: "1", // fuelId por defecto
        type: "AUTO",
        ownerId: "",
        files: []
    });
    const [error, setError] = useState("");

    const FUEL_TYPES = [
        { fuelId: 1, code: "GASOLINA", description: "Gasolina" },
        { fuelId: 2, code: "DIESEL", description: "Diésel" },
        { fuelId: 3, code: "GLP", description: "Gas Licuado de Petróleo" },
        { fuelId: 4, code: "GNV", description: "Gas Natural Vehicular" },
        { fuelId: 5, code: "ELECTRICO", description: "Eléctrico" },
        { fuelId: 6, code: "HIBRIDO", description: "Híbrido" },
    ];

    const VEHICLE_TYPES = [
        { code: "AUTO", label: "Automóvil" },
        { code: "MOTO", label: "Motocicleta" },
        { code: "CAMION", label: "Camión" },
        { code: "BUS", label: "Autobús" },
        { code: "VAN", label: "Camioneta" },
    ];

    const YEARS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);
    const COLORS = ["Blanco", "Negro", "Gris", "Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Marrón", "Plateado", "Dorado", "Beige"];

    function submit(e) {
        e.preventDefault();
        if (!form.plate) return setError("Placa requerida.");
        if (!form.vin || form.vin.length < 11 || form.vin.length > 17) return setError("VIN inválido (11-17 caracteres).");
        if (!form.brand) return setError("Marca requerida.");
        if (!form.model) return setError("Modelo requerido.");
        if (!form.year) return setError("Año requerido.");
        if (!form.color) return setError("Color requerido.");
        if (!form.ownerId) return setError("Titular requerido.");

        setError("");

        const selectedModel = VEHICLE_MODELS_BY_BRAND[form.brand]?.find(m => m.name === form.model);

        const newVehicle = {
            vin: form.vin,
            plate: form.plate,
            vehicleTypeCode: form.type,
            vehicleMakeId: selectedModel?.makeId,
            vehicleMakeName: form.brand,
            vehicleModelName: form.model,
            modelYear: parseInt(form.year),
            vehicleModelYearFrom: parseInt(form.year),  // Mismo año en ambos campos
            fuelTypeCode: FUEL_TYPES.find(f => f.fuelId === Number(form.fuel))?.code || "GASOLINA",
            color: form.color,
            initialHolderId: form.ownerId,
            engineNumber: "N/A",
            grossWeightKg: 1,
            seatCount: form.type === "AUTO" ? 5 : form.type === "MOTO" ? 2 : 4,
            imageUrl: ""
        };

        onAdd(newVehicle);

        setForm({
            vin: "",
            plate: "",
            brand: "",
            model: "",
            year: "",
            color: "",
            fuel: "1",
            type: "AUTO",
            ownerId: "",
            files: []
        });
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Registrar vehículo</h3>
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">{error}</div>}

            <form onSubmit={submit} className="space-y-3">

                {/* VIN y Placa */}
                <div className="grid grid-cols-2 gap-2">
                    <input
                        value={form.vin}
                        onChange={e => setForm({ ...form, vin: e.target.value })}
                        placeholder="VIN (11-17 caracteres)"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        value={form.plate}
                        onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                        placeholder="Placa"
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Tipo y Combustible */}
                <div className="grid grid-cols-2 gap-2">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border p-2 rounded w-full">
                        {VEHICLE_TYPES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                    </select>

                    <select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })} className="border p-2 rounded w-full">
                        {FUEL_TYPES.map(f => <option key={f.fuelId} value={f.fuelId}>{f.description}</option>)}
                    </select>
                </div>

                {/* Marca y Modelo */}
                <div className="grid grid-cols-2 gap-2">
                    <select value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value, model: "" })} className="border p-2 rounded w-full">
                        <option value="">Seleccionar marca</option>
                        {Object.keys(VEHICLE_MODELS_BY_BRAND).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select
                        value={form.model}
                        onChange={e => setForm({ ...form, model: e.target.value })}
                        className="border p-2 rounded w-full"
                        disabled={!form.brand}
                    >
                        <option value="">Seleccionar modelo</option>
                        {form.brand && VEHICLE_MODELS_BY_BRAND[form.brand]?.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {/* Año y Color */}
                <div className="grid grid-cols-2 gap-2">
                    <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="border p-2 rounded w-full">
                        <option value="">Seleccionar año</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="border p-2 rounded w-full">
                        <option value="">Seleccionar color</option>
                        {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Titular */}
                <select value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} className="border p-2 rounded w-full">
                    <option value="">Seleccionar titular</option>
                    {owners.map(o => <option key={o.id} value={o.id}>{o.fullName}</option>)}
                </select>

                <button type="submit" className="px-3 py-2 rounded text-white font-medium" style={{ backgroundColor: "#F2994A" }}>
                    Registrar vehículo
                </button>
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
  

  // Si el usuario es Inspector/Supervisor, solo mostrar su taller
  const availableTalleres = talleres;

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
        templateId: "a6eda317-b11e-4e7f-9d6f-e474a6087c29",
        datetime: `${form.date}T${form.time || "09:00"}:00`,
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
            {inspectors.map(i=> (
              <option key={i.id} value={i.id}>{i.username}</option>
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
   Execute inspection 
   ===================== */
function ExecuteInspection({ inspection, onSaveProgress, onFinish, onCancel }) {
    const [items, setItems] = useState(() => {
        const template =
            INSPECTION_TEMPLATES[inspection.vehicleType] || INSPECTION_TEMPLATES.AUTO;

        // Indexar items del backend por itemId para acceso rápido
        const backendItemsMap = new Map(
            (inspection.items || []).map(item => [item.itemId, item])
        );

        return template.map((tpl) => {
            const backendItem = backendItemsMap.get(tpl.itemId);

            return {
                // Identidad y definición SIEMPRE desde el template
                itemId: tpl.itemId,
                code: tpl.code,
                name: tpl.name,
                category: tpl.category,
                description: tpl.description,
                resultType: tpl.resultType,

                // ✅ valores por defecto desde el template
                unit: tpl.unit,
                minValue: tpl.minValue,
                maxValue: tpl.maxValue,
                severityIfFail: tpl.severityIfFail,

                // IDs y estado del backend (si existen)
                resultId: backendItem?.resultId,

                status: backendItem?.status || "No aplica",
                valueBoolean: backendItem?.valueBoolean ?? null,
                valueNumeric: backendItem?.valueNumeric ?? "",
                valueEnum: backendItem?.valueEnum ?? null,
                comment: backendItem?.comment || "",
                photos: backendItem?.photos || [],

                // Defectos
                defectSeverity: backendItem?.defectSeverity || "",
                defectDescription: backendItem?.defectDescription || "",
                hasDefects: backendItem?.hasDefects || false
            };
        });
    });

    const [progress, setProgress] = useState(0);
    const [mileage, setMileage] = useState(inspection.odometerKm || "");

    useEffect(() => {
        const done = items.filter(it => it.status !== "No aplica" && it.status !== "").length;
        setProgress(Math.round((done / items.length) * 100));
    }, [items]);

    const handlePhoto = async (file, itemCode) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await httpService.uploadFile(
                API_ENDPOINTS.UPLOAD_EVIDENCE,
                formData
            );

            const imageUrl = response.url;

            setItems(prev =>
                prev.map(it =>
                    it.code === itemCode
                        ? { ...it, photos: [...it.photos, { name: file.name, data: imageUrl }] }
                        : it
                )
            );
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            alert('Error al subir la imagen');
        }
    };

    const updateItem = (itemCode, patch) => {
        setItems(prev => prev.map(it =>
            it.code === itemCode ? { ...it, ...patch } : it
        ));
    };

    const renderItemInput = (item) => {
        if (item.resultType === "BOOLEAN") {
            return (
                <select
                    value={item.status}
                    onChange={(e) => {
                        const newStatus = e.target.value;
                        updateItem(item.code, {
                            status: newStatus,
                            valueBoolean: newStatus === "Aprobado" ? true :
                                newStatus === "Falla" ? false : null,
                            defectSeverity: newStatus === "Falla" ? item.severityIfFail : "",
                            defectDescription: newStatus === "Falla" ? "" : ""
                        });
                    }}
                    className="border p-1 rounded"
                >
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
                        onChange={(e) => {
                            const val = e.target.value ? parseFloat(e.target.value) : null;
                            const passes = val !== null &&
                                (!item.minValue || val >= item.minValue) &&
                                (!item.maxValue || val <= item.maxValue);
                            updateItem(item.code, {
                                valueNumeric: e.target.value,
                                status: e.target.value === "" ? "No aplica" :
                                    passes ? "Aprobado" : "Falla",
                                defectSeverity: !passes && e.target.value !== "" ? item.severityIfFail : "",
                                defectDescription: !passes && e.target.value !== "" ? "" : ""
                            });
                        }}
                        placeholder={`${item.unit || ""}`}
                        className="border p-1 rounded w-24"
                    />
                    <span className="text-xs text-gray-600">
                        {item.minValue != null && `≥${item.minValue}`}
                        {item.minValue != null && item.maxValue != null && " / "}
                        {item.maxValue != null && `≤${item.maxValue}`}
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

      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <label className="text-sm font-medium text-blue-800 block mb-2">Kilometraje del vehículo *</label>
        <div className="flex gap-2 items-center">
          <input 
            type="number"
            min="0"
            value={mileage}
            onChange={(e)=>setMileage(e.target.value)}
            placeholder="Ej: 50000"
            className="border p-2 rounded w-48 text-sm"
          />
          <span className="text-sm text-gray-600">km</span>
          {mileage && (
            <span className="text-xs text-green-600 ml-2">✓ {parseInt(mileage).toLocaleString()} km registrados</span>
          )}
        </div>
        {!mileage && (
          <p className="text-xs text-orange-600 mt-1">⚠ Este dato es obligatorio para completar la inspección</p>
        )}
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
              
              {/*<input */}
              {/*  placeholder="Comentario adicional" */}
              {/*  value={it.comment} */}
              {/*  onChange={(e)=>updateItem(it.code, { comment: e.target.value })} */}
              {/*  className="border p-1 rounded text-sm flex-1 min-w-[200px]" */}
              {/*/>*/}
              
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
          onClick={() => {
            if (!mileage) {
              alert("Por favor ingresa el kilometraje del vehículo");
              return;
            }
            onSaveProgress({ inspectionId: inspection.id, items, mileage: parseInt(mileage) });
          }} 
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
          onClick={() => {
            if (!mileage) {
              alert("Por favor ingresa el kilometraje del vehículo antes de finalizar");
              return;
            }
            onFinish({ ...inspection, items, mileage: parseInt(mileage) });
          }} 
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

    const addUser = async () => {
        if (!newUser.fullName || !newUser.email) {
            alert("Nombre completo y correo son obligatorios");
            return;
        }

        try {
            let response;
            let userId;

            // 1. CREAR USUARIO SEGÚN EL ROL
            if (newUser.role === "Titular") {
                // Crear Titular
                if (!newUser.document) {
                    alert("El documento es obligatorio para Titulares");
                    return;
                }

                response = await httpService.post(API_ENDPOINTS.REGISTER_HOLDER, {
                    email: newUser.email,
                    password: "Temporal123!", // Password temporal
                    documentType: "CEDULA",
                    documentNumber: newUser.document,
                    fullNameOrCorporate: newUser.fullName,
                    phone: newUser.phone || "",
                    addressLine: newUser.address || "",
                    municipalityId: 1
                });

                userId = response.userId;
                console.log("✓ Titular creado:", userId);

            } else if (newUser.role === "Inspector" || newUser.role === "Supervisor") {
                // Crear usuario de Taller (Inspector o Supervisor)
                if (!newUser.workshopId) {
                    alert("Debe seleccionar un taller para Inspector/Supervisor");
                    return;
                }

                response = await httpService.post(API_ENDPOINTS.CREATE_WORKSHOP_USER, {
                    email: newUser.email,
                    phone: newUser.phone || "",
                    workshopId: newUser.workshopId,
                    roleInWorkshop: newUser.role === "Supervisor" ? "SUPERVISOR" : "INSPECTOR"
                });

                userId = response.userId;
                console.log("✓ Usuario de taller creado:", userId);

            } else if (newUser.role === "Administrador") {
                // Crear cuenta base
                response = await httpService.post(API_ENDPOINTS.REGISTER, {
                    email: newUser.email,
                    phone: newUser.phone || "",
                    password: "Temporal123!" // Password temporal
                });

                userId = response.userId;
                console.log("✓ Cuenta base creada:", userId);

                // Asignar rol ADMIN
                await httpService.post(API_ENDPOINTS.ASSIGN_ROLE, {
                    userId: userId,
                    roleCode: "ADMIN"
                });

                console.log("✓ Rol ADMIN asignado");
            }

            // 2. AGREGAR A LA LISTA LOCAL
            const userData = {
                id: userId,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                workshopId: newUser.workshopId || null,
                document: newUser.document || "",
                phone: newUser.phone || "",
                verified: true,
                firstLogin: true
            };

            setUsers(prev => [userData, ...prev]);

            // 3. LIMPIAR FORMULARIO
            setNewUser({
                fullName: "",
                email: "",
                role: "Inspector",
                workshopId: "",
                document: "",
                phone: "",
                address: ""
            });

            alert(`✓ Usuario ${newUser.role} creado exitosamente`);

        } catch (error) {
            console.error("Error creando usuario:", error);
            alert(`Error al crear usuario: ${error.message}`);
        }

        await loadUsers();
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
                        {/* Fila 1: Nombre y Email */}
                        <div className="flex gap-2">
                            <input
                                value={newUser.fullName}
                                onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                placeholder="Nombre completo"
                                className="border p-2 rounded flex-1"
                            />
                            <input
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="Correo"
                                className="border p-2 rounded flex-1"
                            />
                        </div>

                        {/* Fila 2: Teléfono y Documento */}
                        <div className="flex gap-2">
                            <input
                                value={newUser.phone || ""}
                                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                placeholder="Teléfono"
                                className="border p-2 rounded flex-1"
                            />
                            <input
                                value={newUser.document || ""}
                                onChange={e => setNewUser({ ...newUser, document: e.target.value })}
                                placeholder={newUser.role === "Titular" ? "Cédula/RNC *" : "Documento (opcional)"}
                                className="border p-2 rounded flex-1"
                            />
                        </div>

                        {/* Fila 3: Rol y Taller (solo si es Inspector/Supervisor) */}
                        <div className="flex gap-2">
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                className="border p-2 rounded flex-1"
                            >
                                <option>Inspector</option>
                                <option>Administrador</option>
                                <option>Titular</option>
                            </select>

                            {(newUser.role === "Inspector" || newUser.role === "Supervisor") && (
                                <select
                                    value={newUser.workshopId}
                                    onChange={e => setNewUser({ ...newUser, workshopId: e.target.value })}
                                    className="border p-2 rounded flex-1"
                                >
                                    <option value="">Seleccionar taller *</option>
                                    {talleres.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            )}
                        </div>

                        {/* Fila 4: Dirección (solo para Titular) */}
                        {newUser.role === "Titular" && (
                            <input
                                value={newUser.address || ""}
                                onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                                placeholder="Dirección (opcional)"
                                className="border p-2 rounded w-full"
                            />
                        )}

                        {/* Fila 5: Botón Agregar */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={addUser}
                                className="px-4 py-2 rounded flex items-center gap-2"
                                style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}
                            >
                                <UserPlus className="w-4 h-4" />
                                Agregar Usuario
                            </button>
                        </div>

                        {/* Lista de usuarios */}
                        <div className="mt-3 border-t pt-2 max-h-96 overflow-y-auto">
                            {users.map(u => (
                                <div key={u.userId} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                        <div className="font-medium">{u.email}</div>
                                        <div className="text-sm text-gray-600">
                                            {u.phone} - {u.status}
                                        </div>
                                    </div>
                                    <button onClick={() => delUser(u.userId)} className="px-2 py-1 text-xs rounded border hover:bg-red-50 hover:text-red-600">
                                        Borrar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Talleres Autorizados</h3>
                    <div className="space-y-2">
                        <input value={newTaller.name} onChange={e => setNewTaller({ ...newTaller, name: e.target.value })} placeholder="Nombre del taller" className="border p-2 rounded w-full" />
                        <div className="flex gap-2">
                            <input value={newTaller.rnc} onChange={e => setNewTaller({ ...newTaller, rnc: e.target.value })} placeholder="RNC" className="border p-2 rounded flex-1" />
                            <button onClick={addTaller} className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>Agregar</button>
                        </div>
                    </div>

                    <div className="mt-3 border-t pt-2">
                        {talleres.map(t => (
                            <div key={t.id} className="flex justify-between items-center py-2 border-b">
                                <div>
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-sm text-gray-600">{t.rnc}</div>
                                </div>
                                <button onClick={() => delTaller(t.id)} className="px-2 py-1 text-xs rounded border hover:bg-red-50 hover:text-red-600">Borrar</button>
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

    /* Modal states */
    const [showAbout, setShowAbout] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
        { id: "1", name: "Juan Pérez", email: "juan.perez@example.com", role: "Inspector" },
        { id: "2", name: "María López", email: "maria.lopez@example.com", role: "Inspector" },
        { id: "3", name: "Carlos García", email: "carlos.garcia@example.com", role: "Inspector" },
        { id: "4", name: "Ana Martínez", email: "ana.martinez@example.com", role: "Inspector" }
    ]);

    const [holders, setHolders] = useState([
        {
            holderId: "3f23aa3f-b26e-4915-bccf-b46d1f8b6671",
            userId: "b81055ac-ee5d-4409-b070-7efbf83ee1d6",
            documentType: "CEDULA",
            documentNumber: "123456789",
            fullNameOrCorporate: "Angel Antonio Orona Pimentel",
            email: "antonioorona"
        }
    ]);

    const [templates, setTemplates] = useState([{
        templateId: "a1",
        typeId: 1,
        templateName: "ITV Básica",
        resolutionId: "r1",
        resolutionCode: "RES-001-2024",
        resolutionTitle: "Resolución General de ITV 2024",
        version: 1,
        isActive: true,
        checkItems: []
    }, 
    {
        templateId: "a2",
        typeId: 2,
        templateName: "ITV Avanzada",
        resolutionId: "r2",
        resolutionCode: "RES-002-2024",
        resolutionTitle: "Resolución Especial de ITV 2024",
        version: 1,
        isActive: true,
        checkItems: []
    },
    {
        templateId: "a3",
        typeId: 3,
        templateName: "ITV Completa",
        resolutionId: "r3",
        resolutionCode: "RES-003-2024",
        resolutionTitle: "Resolución Completa de ITV 2024",
        version: 1,
        isActive: true,
        checkItems: []
    }
    ]);


    const [talleres, setTalleres] = useState([
        { id: "w1", name: "Taller Los Robles", rnc: "RNC-123456" },
        { id: "w2", name: "Taller San Cristóbal", rnc: "RNC-789012" },
        { id: "w3", name: "Taller El Progreso", rnc: "RNC-456789" },
        { id: "w4", name: "Centro de Inspección San Cristóbal", rnc: "RNC-111222" },
        { id: "w5", name: "Taller Mecánico Central", rnc: "RNC-333444" },
        { id: "w6", name: "Inspecciones Técnicas del Este", rnc: "RNC-555666" },
    ]);

    const [fuelTypes, setFuelTypes] = useState([]);


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

    //const [vehicleTypes, setVehicleTypes] = useState([
    //    { id: 1, name: "Automóvil" },
    //    { id: 2, name: "Motocicleta" },
    //    { id: 3, name: "Camión" },
    //    { id: 4, name: "SUV" },
    //]);
    const VEHICLE_TYPE_MAP = VEHICLE_TYPES.reduce((acc, curr) => {
        acc[curr.code] = curr.label;
        return acc;
    }, {});

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

            // 2. Verificar acceso al portal seleccionado
            const hasAccess = validatePortalAccess(portal, response.roles);
            if (!hasAccess) {
                alert(`No tienes permisos para acceder al portal de ${portal}`);
                setPortal(null);
                return;
            }

            // 3. Establecer el Token
            httpService.setToken(response.token);

            // 4. Determinar el rol según el portal
            const userRole = determineUserRole(portal, response.roles);

            // 5. Mapear la Respuesta del Backend al Objeto de Usuario
            const user = {
                id: response.userId,
                email: response.email,
                fullName: response.fullName || response.email,
                role: userRole,
                firstLogin: response.mustChangePassword || false,
                workshopId: response.workshopId || null,
                verified: response.status === 'ACTIVE',
                allRoles: response.roles
            };

            // 6. Configurar el Estado de la Aplicación
            setLoggedUser(user);
            setRole(user.role);
            setLoggedIn(true);
            setPage("dashboard");

            // 7. Cargar Datos Adicionales
            await loadInitialData();

        } catch (error) {
            console.error("Login Failed:", error);
            httpService.setToken(null); // Limpiar token si falla
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
    //Validar si el usuario tiene acceso al portal
    function validatePortalAccess(portal, roles) {
        const accessMap = {
            "Titular": ["TITULAR"],
            "Taller": ["INSPECTOR", "SUPERVISOR"],
            "Administrador": ["ADMIN", "SUPERVISOR"]
        };

        const requiredRoles = accessMap[portal] || [];
        return requiredRoles.some(role => roles.includes(role));
    }

    //Determinar el rol específico según el portal
    function determineUserRole(portal, roles) {
        if (portal === "Titular") return "Titular";

        if (portal === "Taller") {
            if (roles.includes("SUPERVISOR")) return "Supervisor";
            if (roles.includes("INSPECTOR")) return "Inspector";
            return "Taller";
        }

        if (portal === "Administrador") {
            if (roles.includes("ADMIN")) return "Administrador";
            if (roles.includes("SUPERVISOR")) return "Supervisor";
            return "Administrador";
        }

        return portal;
    }
    /* =========================
       Vehicle handlers
       ========================= */
    const addVehicle = async (vehicleData) => {
        try {
            // vehicleData ya viene con todos los campos correctos desde VehicleRegister
            const response = await httpService.post(API_ENDPOINTS.VEHICLE_REGISTER, vehicleData);

            const newVehicle = {
                vehicleId: response.vehicleId,
                ...vehicleData,
                currentHolderName: users.find(u => u.id === vehicleData.initialHolderId)?.fullName || "Sin asignar",
                currentHolderId: vehicleData.initialHolderId
            };

            setVehicles(prev => [newVehicle, ...prev]);
            alert("Vehículo registrado exitosamente");
        } catch (error) {
            alert(`Error al registrar vehículo: ${error.message}`);
        }
    };

   

    /* Funciones de INSPECCION
     */

    // Función para cargar todos los datos al iniciar sesión
    const loadInitialData = async () => {
        try {
            console.log("🔄 Cargando datos iniciales...");

            // Funciones internas de carga
            const loadAllInspections = async () => {
                const response = await httpService.get(API_ENDPOINTS.INSPECTION_GET_ALL);
                const completedInspections = [];
                const scheduledInspections = [];

                response.forEach(i => {
                    const inspectionData = {
                        id: i.inspectionId,
                        vehicle: i.vehiclePlate,
                        vehicleId: i.vehicleId,
                        //vehicleType: getVehicleTypeName(i.typeId),
                        templateId: i.templateId,
                        datetime: i.scheduledAt?.split("T")[0] + " " + (i.scheduledAt?.split("T")[1]?.substring(0, 5) || "00:00"),
                        inspectorId: i.inspectorUserId,
                        workshopId: i.workshopId,
                        taller: i.workshopName || "N/A",
                        notes: i.comments || "",
                        odometerKm: i.odometerKm,
                        totalItems: i.totalItems,
                        completedItems: i.completedItems,
                        pendingItems: i.pendingItems,
                        defectsCount: i.defectsCount
                    };

                    if (i.status === "COMPLETED" && i.overallResult) {
                        completedInspections.push({
                            ...inspectionData,
                            date: i.finishedAt?.split("T")[0] || i.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
                            result: i.overallResult === "PASS" ? "Aprobado" :
                                i.overallResult === "FAIL" ? "Rechazado" : "No Evaluado",
                            items: []
                        });
                    } else {
                        scheduledInspections.push({
                            ...inspectionData,
                            status: i.status === "IN_PROGRESS" ? "En proceso" :
                                i.status === "SCHEDULED" ? "Programada" : "Programada"
                        });
                    }
                });

                setInspections(completedInspections);
                setScheduled(scheduledInspections);
                console.log(`✓ Cargadas ${completedInspections.length} inspecciones completadas`);
                console.log(`✓ Cargadas ${scheduledInspections.length} inspecciones programadas/en progreso`);
            };

            const loadTemplates = async () => {
                const response = await httpService.get(API_ENDPOINTS.TEMPLATES_GET_ALL);
                const templates = response.map(t => ({
                    id: t.templateId,
                    type: VEHICLE_TYPES.find(v => v.id === t.typeId)?.code || "AUTO",
                    name: t.templateName,
                    resolutionId: t.resolutionId,
                    resolutionCode: t.resolutionCode,
                    resolutionTitle: t.resolutionTitle,
                    version: t.version,
                    isActive: t.isActive,
                    checkItems: t.checkItems || []
                }));
                setTemplates(templates);
                console.log(`✓ Cargadas ${templates.length} plantillas de inspección`);
            };

            const loadCertificates = async () => {
                const response = await httpService.get(API_ENDPOINTS.CERTIFICATE_GET_ALL);
                const certsData = response.map(c => ({
                    id: c.certificateId,
                    vehicle: c.vehiclePlate || "N/A",
                    date: c.issuedAt?.split("T")[0],
                    status: c.status ,
                    details: c.comments || "Certificado de inspección técnica vehicular",
                    expiryDate: c.validUntil,
                    qrHash: c.qrHash
                }));
                setCertificates(certsData);
                console.log(`✓ Cargados ${certsData.length} certificados`);
            };

            const loadUserVehicles = async () => {
                const response = await httpService.get(API_ENDPOINTS.VEHICLE_GET_ALL);
                const vehiclesData = response.map(v => ({
                    id: v.vehicleId,
                    plate: v.plate,
                    vin: v.vin,
                    brand: v.make,
                    type: v.type,
                    model: v.model,
                    year: v.modelYear,
                    status: v.status,
                    color: v.color,
                    fuel: v.fuelId,
                    owner: v.currentHolderName || "Sin asignar",
                    documents: []
                }));
                setVehicles(vehiclesData);
                console.log(`✓ Cargados ${vehiclesData.length} vehículos`);
                console.log('Respuesta de Vehiculos:', vehiclesData);

            };
            const loadUsers = async () => {
                try {
                    const response = await httpService.get(API_ENDPOINTS.GET_ALL_USERS);
                    setUsers(response); // Directo, sin mapeo
                    console.log('✓ Usuarios cargados');
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            // Ejecutar todas las cargas en paralelo
            await Promise.all([
                loadVehicleModels(),
                loadInspectors(),
                loadHolders(),
                loadWorkshops(),
                loadFuelTypes(),
                loadVehicleTypes(),
                loadAllInspections(),
                loadTemplates(),
                loadCertificates(),
                loadUserVehicles(),
                loadUsers()
            ]);

            console.log("✅ Todos los datos iniciales cargados correctamente");
        } catch (error) {
            console.error("❌ Error cargando datos iniciales:", error);
        }
    };



    // 1. Modelos de vehículos
    const loadVehicleModels = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.VEHICLE_MODELS_GET_ALL);

            const models = response.map(m => ({
                id: m.modelId,
                makeId: m.makeId,
                makeName: m.makeName,
                name: m.name,
                type: m.type,
                fullName: `${m.makeName} ${m.name}`,
                yearFrom: m.yearFrom,
                yearTo: m.yearTo,
                createdAt: m.createdAt
            }));

            const modelsByBrand = models.reduce((acc, v) => {
                if (!acc[v.makeName]) acc[v.makeName] = [];
                acc[v.makeName].push(v);
                return acc;
            }, {});

            //setVehicleModels(models);              // array plano
            //setVehicleModelsByBrand(modelsByBrand); // agrupado por marca

            console.log("✓ Modelos agrupados por marca:", modelsByBrand);
            return models;
        } catch (error) {
            console.error("Error cargando modelos de vehículos:", error);
            throw error;
        }
    };



    // 2. Inspectores (usuarios de talleres)
    const loadInspectors = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.GET_WORKSHOP_USERS);
            console.log("Response de inspectores:", response);

            const inspectors = response.map(i => ({
                id: i.workshopUserId,
                userId: i.userId,
                workshopId: i.workshopId,
                workshopName: i.workshopName,
                username: i.username,
                role: i.roleInWorkshop,
                active: i.active,
                assignedAt: i.assignedAt,
                updatedAt: i.updatedAt
            }));

            setInspectors(inspectors);
            console.log(`✓ Cargados ${inspectors.length} inspectores`);

            return inspectors;
        } catch (error) {
            console.error('Error cargando inspectores:', error);
            throw error;
        }
    };

    // 3. Titulares
    const loadHolders = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.GET_HOLDERS);

            const holders = response.map(h => ({
                id: h.holderId,
                userId: h.userId,
                documentType: h.documentType,
                documentNumber: h.documentNumber,
                fullName: h.fullNameOrCorporate,
                email: h.email,
                phone: h.phone,
                municipality: h.municipalityName,
                createdAt: h.createdAt
            }));

            console.log(`✓ Cargados ${holders.length} titulares`);
            setHolders(holders)
            return holders;
        } catch (error) {
            console.error('Error cargando titulares:', error);
            throw error;
        }
    };

    // 4. Talleres
    const loadWorkshops = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.GET_WORKSHOPS);

            const workshops = response.map(w => ({
                id: w.workshopId,
                rnc: w.rnc,
                name: w.name,
                email: w.email,
                phone: w.phone,
                address: w.addressLine,
                municipality: w.municipalityName,
                status: w.status,
                authorizedSince: w.authorizedSince,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt
            }));

            setTalleres(workshops);
            console.log(`✓ Cargados ${workshops.length} talleres`);

            return workshops;
        } catch (error) {
            console.error('Error cargando talleres:', error);
            throw error;
        }
    };

    // 5. Tipos de combustible
    const loadFuelTypes = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.FUEL_TYPES_GET_ALL);

            const fuelTypes = response.map(f => ({
                id: f.fuelId,
                code: f.code,
                description: f.description,
                createdAt: f.createdAt
            }));

            setFuelTypes(fuelTypes);
            console.log(`✓ Cargados ${fuelTypes.length} tipos de combustible`);

            return fuelTypes;
        } catch (error) {
            console.error('Error cargando tipos de combustible:', error);
            throw error;
        }
    };

    // 6. Plantillas de inspección
   
    const loadInspections = async () => {
        try {
            const inspections = await httpService.get(API_ENDPOINTS.INSPECTION_GET_ALL);

            // Mapear las inspecciones al formato que usa tu UI
            const mappedInspections = inspections.map(insp => ({
                id: insp.inspectionId,
                vehicle: insp.vehiclePlate,
                vehicleType: insp.vehicleType,
                templateId: insp.templateId,
                datetime: insp.scheduledAt,
                inspectorUserId: insp.inspectorUserId,
                inspector: insp.inspectorEmail,
                taller: insp.workshopName,
                workshopId: insp.workshopId,
                status: insp.status === "IN_PROGRESS" ? "En proceso" :
                    insp.status === "COMPLETED" ? "Completada" :
                        "Programada"
            }));

            setScheduled(mappedInspections);
        } catch (error) {
            console.error("Error cargando inspecciones:", error);
        }
    };

    // Llamar al cargar la página
    useEffect(() => {
        if (loggedIn) {
            loadInspections();
        }
    }, [loggedIn]);

    const loadTemplates = async () => {
            try {
                const response = await httpService.get(API_ENDPOINTS.TEMPLATES_GET_ALL);

                const templates = response.map(t => ({
                    id: t.templateId,
                    type: getVehicleTypeName(t.typeId),
                    name: t.templateName,
                    resolutionId: t.resolutionId,
                    resolutionCode: t.resolutionCode,
                    resolutionTitle: t.resolutionTitle,
                    version: t.version,
                    isActive: t.isActive,
                    checkItems: t.checkItems || []
                }));

                setTemplates(templates);
                console.log(`✓ Cargadas ${templates.length} plantillas de inspección`);
                return templates;
            } catch (error) {
                console.error('Error cargando plantillas de inspección:', error);
                throw error;
            }
    };
    const loadVehicleTypes = async () => {
        try {
            const response = await httpService.get(API_ENDPOINTS.VEHICLE_TYPES_GET_ALL);

            const vehicleTypes = response.map(v => ({
                id: v.typeId,
                code: v.code,
                name: v.description,
                createdAt: v.createdAt
            }));

            //setVehicleTypes(vehicleTypes);
            console.log(`✓ Cargados ${vehicleTypes.length} tipos de vehículos`);

            return vehicleTypes;

        } catch (error) {
            console.error('Error cargando tipos de vehículos:', error);
            throw error;
        }
    };

    //const getVehicleTypeName = (typeId) => {
    //    const type = vehicleTypes.find(v => v.id === typeId);
    //    return type ? type.name : "N/A";
    //};
    //const getMakeNameByModelName = (modelName) => {
    //    const model = vehicleModels.find(m => m.name === modelName);
    //    return model ? model.makeName : "N/A";


    const getTemplateNameById = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        return template ? template.name : "Resolución General de ITV 2024";
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
                templateId: "a6eda317-b11e-4e7f-9d6f-e474a6087c29",
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
                    itemId: item.itemId,
                    valueBoolean: item.valueBoolean,
                    valueNumeric: item.valueNumeric ? parseFloat(item.valueNumeric) : null,
                    valueEnum: item.valueEnum || null,
                    valueText: item.comment || null,
                    passFail: item.status === "Aprobado" ? "PASS" :
                        item.status === "Falla" ? "FAIL" :
                            "PENDING", // ✅ AGREGADO: default para otros estados
                    evidenceUrl: item.photos.length > 0 ? item.photos[0].data : null,
                                    // 🔹 NUEVOS CAMPOS DE DEFECTO
                    hasDefect: item.hasDefects || false,
                    defectSeverity: item.defectSeverity || null,
                    defectComment: item.defectComment || null
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

            alert(`✓ Progreso guardado\n${itemsToUpdate.length} items actualizados`); // ✅ CORREGIDO: sintaxis de alert

        } catch (error) {
            console.error("Error guardando progreso:", error);
            alert(`Error guardando progreso: ${error.message}`); // ✅ CORREGIDO: sintaxis de alert
        }
    };

    const finishInspectionFlow = async (inspectionWithItems) => {
        try {
            console.log("=== FINALIZANDO INSPECCIÓN ===");

            // 1. Validar que todos los items estén evaluados
            const pendingItems = inspectionWithItems.items.filter(item =>
                item.status === "" || item.status === "No aplica"
            );

            if (pendingItems.length > 0) {
                alert(`⚠️ No se puede finalizar la inspección.\nFaltan ${pendingItems.length} items por evaluar.`);
                return;
            }

            // 2. Actualizar items en batch (guardar estado final)
            const batchRequest = {
                items: inspectionWithItems.items.map(item => ({
                    itemId: item.itemId,
                    valueBoolean: item.valueBoolean,
                    valueNumeric: item.valueNumeric ? parseFloat(item.valueNumeric) : null,
                    valueEnum: item.valueEnum || null,
                    valueText: item.comment || null,
                    passFail: item.status === "Aprobado" ? "PASS" : "FAIL",
                    evidenceUrl: item.photos.length > 0 ? item.photos[0].data : null
                }))
            };

            await httpService.put(
                API_ENDPOINTS.INSPECTION_BATCH_UPDATE_ITEMS(inspectionWithItems.id),
                batchRequest
            );

            console.log("✓ Items actualizados");

            // 3. Agregar defectos (si los hay)
            const defects = inspectionWithItems.items
                .filter(item => item.status === "Falla" && item.severityIfFail)
                .map(item => ({
                    itemId: item.itemId,
                    severity: item.severityIfFail,
                    description: item.defectDescription || `Defecto en ${item.name}`,
                    correctiveDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }));

            if (defects.length > 0) {
                console.log(`Registrando ${defects.length} defecto(s)...`);

                for (const defect of defects) {
                    try {
                        await httpService.post(
                            API_ENDPOINTS.INSPECTION_ADD_DEFECT(inspectionWithItems.id),
                            defect
                        );
                    } catch (defectError) {
                        console.error("Error registrando defecto:", defectError);
                    }
                }

                console.log("✓ Defectos registrados");
            }

            // 4. Completar inspección (el backend calcula el resultado)
            console.log("Completando inspección...");

            const completedInspection = await httpService.post(
                API_ENDPOINTS.INSPECTION_COMPLETE(inspectionWithItems.id),
                {
                    finalComments: `Inspección completada. ${defects.length} defecto(s) encontrado(s).`
                }
            );

            console.log("✓ Inspección completada:", completedInspection);

            // 5. Mostrar notificación según resultado
            const resultMap = {
                "PASS": "✓ Aprobada",
                "FAIL": "✗ Rechazada",
                "CONDITIONAL": "⚠ Condicional"
            };

            const resultText = resultMap[completedInspection.overallResult] || completedInspection.overallResult;

            setNotifications(prev => [
                {
                    id: `n${Date.now()}`,
                    title: "Inspección finalizada",
                    message: `${inspectionWithItems.vehicle}: ${resultText}`,
                    status: "Entregado"
                },
                ...prev
            ]);

            // 6. Cerrar la inspección y volver a la lista
            setExecInspection(null);
            setPage("inspections");

            alert(`✓ Inspección completada\n\nVehículo: ${inspectionWithItems.vehicle}\nResultado: ${resultText}\nDefectos: ${defects.length}`);

        } catch (error) {
            console.error("Error al finalizar inspección:", error);
            alert(`Error al finalizar inspección: ${error.message}`);
        }

        // 6. Recargar la lista
        await loadInspections();

        // 7. Cerrar la inspección (sin cambiar de página)
        setExecInspection(null);
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
                date: c.issuedAt?.split('T')[0],
                status: c.status === "VALID" ? "Activo" : c.status === "REVOKED" ? "Revocado" : "Expirado",
                details: c.comments || "Certificado de inspección técnica vehicular",
                expiryDate: c.validUntil,
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
                {/* Modales disponibles antes de login */}
                <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
                <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />
                <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
                
                <TopMenu 
                    loggedIn={loggedIn} 
                    onToggleLogin={() => { setLoggedIn(true); }} 
                    goPortal={(p) => { if (p === 'home') setPortal(null); }}
                    onOpenAbout={() => setShowAbout(true)}
                    onOpenServices={() => setShowServices(true)}
                    onOpenContact={() => setShowContact(true)}
                    onOpenNotifications={() => {}}
                    onOpenSettings={() => {}}
                />
                <div className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
                        <div>
                            <Login onLogin={(creds) => handleLogin(creds)} onForgot={() => alert("Funcionalidad de recuperación de contraseña estará disponible próximamente")} />
                        </div>
                        <div>
                            <Register portal={portal} onRegister={(payload) => handleRegister(payload)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

        const FUEL_TYPES = [
            { fuelId: 1, code: "GASOLINA", description: "Gasolina" },
            { fuelId: 2, code: "DIESEL", description: "Diésel" },
            { fuelId: 3, code: "GLP", description: "Gas Licuado de Petróleo" },
            { fuelId: 4, code: "GNV", description: "Gas Natural Vehicular" },
            { fuelId: 5, code: "ELECTRICO", description: "Eléctrico" },
            { fuelId: 6, code: "HIBRIDO", description: "Híbrido" },
        ];

    const getFuelDescription = (fuel) => {
        const fuelObj = FUEL_TYPES.find(f => f.fuelId === Number(fuel));
        return fuelObj ? fuelObj.description : "Desconocido";
    };

    /* =========================
       Main logged-in layout
       ========================= */
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grayBg }}>
            {/* Modals */}
            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
            <ServicesModal isOpen={showServices} onClose={() => setShowServices(false)} />
            <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <NotificationsPanel 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onRetry={retryNotification}
            />
            
            <TopMenu 
                loggedIn={loggedIn} 
                onToggleLogin={handleLogout} 
                goPortal={(p) => { 
                    if (p === 'home') { 
                        if (loggedIn) {
                            setPage("dashboard");
                        } else {
                            setPortal(null); 
                            setLoggedIn(false); 
                        }
                    } 
                }}
                onOpenAbout={() => setShowAbout(true)}
                onOpenServices={() => setShowServices(true)}
                onOpenContact={() => setShowContact(true)}
                onOpenNotifications={() => setShowNotifications(true)}
                onOpenSettings={() => setShowSettings(true)}
            />
            <div className="flex flex-1">
                <Sidebar role={role || (loggedUser?.role ?? portal)} page={page} setPage={setPage} username={loggedUser?.fullName || "Usuario"} />
                <main className="flex-1 p-6 overflow-auto">
                    {page === "dashboard" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>Panel de Control</h1>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded shadow">
                                    <div className="text-sm text-gray-600">Inspecciones totales</div>
                                    <div className="text-2xl font-bold">{inspections.length}</div>
                                    <div className="text-xs text-green-600">↗ {inspections.filter(i => i.result === "Aprobado").length} aprobadas</div>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <div className="text-sm text-gray-600">Certificados activos</div>
                                    <div className="text-2xl font-bold">{certificates.filter(c => c.status === "ISSUED").length}</div>
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
                                                { name: "Aprobadas", value: inspections.filter(i => i.result === "Aprobado").length },
                                                { name: "Rechazadas", value: inspections.filter(i => i.result === "Rechazado").length },
                                                { name: "En proceso", value: inspections.filter(i => i.result === "En progreso").length },
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

    {/* Vehicles */ }
    {page === "vehicles" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-4" style={{ color: COLORS.intrantBlue }}>
                                Gestión de Vehículos
                            </h1>
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
                                                        <th className="p-2">Estado</th>
                                                        <th className="p-2">Titular</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {vehicles.map(v => (
                                                        <tr key={v.id} className="border-t hover:bg-gray-50 cursor-pointer">
                                                            <td className="p-2 font-bold" style={{ color: COLORS.intrantBlue }}>
                                                                {v.plate}
                                                            </td>

                                                            <td className="p-2 text-xs text-gray-600">
                                                                {v.vin || "N/A"}
                                                            </td>

                                                            <td className="p-2">
                                                                {v.brand} {v.model}
                                                            </td>

                                                            <td className="p-2">{v.year}</td>

                                                            <td className="p-2">
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                    {v.type}
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
                                                                    {getFuelDescription(v.fuel)}
                                                                </span>
                                                            </td>

                                                            <td className="p-2">
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                                    {v.status}
                                                                </span>
                                                            </td>

                                                            <td className="p-2 text-xs">
                                                                {v.owner || "N/A"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <VehicleRegister owners={holders} onAdd={addVehicle} />
                                </div>
                            </div>
                        </div>

        )}

    {/* Inspections: schedule + execute */ }
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
                                    <tr><th className="p-2">Vehículo</th><th className="p-2">Plantilla</th><th className="p-2">Fecha/Hora</th><th className="p-2">Inspector</th><th className="p-2">Estado</th><th className="p-2">Acciones</th></tr>
                                </thead>
                                <tbody>
                                                {scheduled
                                                    .filter(s => s.status === 'Programada' || s.status === 'En proceso')
                                                    .map(s => (
                                            <tr key={s.id} className="border-t">
                                                <td className="p-2 font-medium">{s.vehicle}</td>
                                                <td className="p-2">{getTemplateNameById(s.templateId)}</td>
                                                <td className="p-2">
                                                    {new Date(s.datetime).toLocaleDateString('es-DO')}
                                                </td>
                                                <td className="p-2">
                                                    {inspectors.find(i => String(i.inspectorUserId) === String(s.userId))?.username || 'Desconocido'}
                                                </td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${s.status === 'Programada' ? 'bg-blue-100 text-blue-800' : s.status === 'En proceso' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                        {s.status}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                // Mostrar indicador de carga
                                                                const loadingMsg = s.status === "En proceso" ? "Cargando inspección..." : "Iniciando inspección...";
                                                                console.log(loadingMsg);

                                                                // Obtener los detalles completos de la inspección
                                                                const inspectionDetail = await httpService.get(
                                                                    API_ENDPOINTS.INSPECTION_DETAIL(s.id)
                                                                );
                                                                const inspectionDefects = await httpService.get(
                                                                    API_ENDPOINTS.INSPECTION_GET_DEFECTS(s.id)
                                                                );

                                                                console.log("Inspección cargada:", inspectionDetail);
                                                                console.log("Defectos cargados:", inspectionDefects);

                                                                // Verificar si tiene items (resultados)
                                                                if (!inspectionDetail.results || inspectionDetail.results.length === 0) {
                                                                    alert("⚠️ Esta inspección no tiene items asociados. Verifica la creación de la inspección.");
                                                                    return;
                                                                }

                                                                // Mapear los items del backend al formato del frontend
                                                                const items = inspectionDetail.results.map(result => {
                                                                    // Buscar defecto asociado (si existe)
                                                                    const defect = inspectionDefects.find(d => d.itemId === result.itemId);

                                                                    return {

                                                                        // IDs y códigos
                                                                        itemId: result.itemId,
                                                                        resultId: result.resultId,
                                                                        code: result.itemCode,

                                                                        // Información del item
                                                                        name: result.itemName,
                                                                        description: result.itemDescription,
                                                                        category: result.category,
                                                                        resultType: result.resultType,

                                                                        // Validaciones numéricas
                                                                        unit: result.unit,
                                                                        minValue: result.minValue,
                                                                        maxValue: result.maxValue,
                                                                        allowedValues: result.allowedValues,

                                                                        // Estado de evaluación
                                                                        status: result.passFail === "PASS" ? "Aprobado" :
                                                                            result.passFail === "FAIL" ? "Falla" :
                                                                                result.passFail === "PENDING" ? "" : "",

                                                                        // Valores capturados
                                                                        valueBoolean: result.valueBoolean,
                                                                        valueNumeric: result.valueNumeric,
                                                                        valueEnum: result.valueEnum,
                                                                        comment: result.valueText || "",

                                                                        // Evidencias
                                                                        photos: result.evidenceUrl ? [{ data: result.evidenceUrl }] : [],
                                                                        evidenceUrl: result.evidenceUrl,

                                                                        // Defectos (si los hay)
                                                                        hasDefects: !!defect,
                                                                        defectSeverity: defect?.severity || null,
                                                                        defectDescription: defect?.description || null                                                                    }
                                                                });

                                                                console.log(`${items.length} items cargados con itemId`);
                                                                console.log(`${items.length} items cargados con defectos asociados`);


                                                                // Establecer la inspección en ejecución
                                                                setExecInspection({
                                                                    id: inspectionDetail.inspectionId,
                                                                    vehicle: inspectionDetail.vehiclePlate,
                                                                    vehicleVin: inspectionDetail.vehicleVin,
                                                                    vehicleType: s.vehicleType,
                                                                    inspector: inspectionDetail.inspectorEmail,
                                                                    taller: inspectionDetail.workshopName,
                                                                    workshopId: inspectionDetail.workshopId,
                                                                    items: items,

                                                                    // Metadata adicional
                                                                    scheduledAt: inspectionDetail.scheduledAt,
                                                                    startedAt: inspectionDetail.startedAt,
                                                                    odometerKm: inspectionDetail.odometerKm,
                                                                    comments: inspectionDetail.comments,
                                                                    status: inspectionDetail.status,
                                                                    totalItems: inspectionDetail.totalItems,
                                                                    completedItems: inspectionDetail.completedItems,
                                                                    pendingItems: inspectionDetail.pendingItems
                                                                });

                                                            } catch (error) {
                                                                console.error("Error cargando inspección:", error);
                                                                alert(`Error al cargar la inspección: ${error.message}`);
                                                            }
                                                        }}
                                                        className="px-2 py-1 rounded border text-sm hover:bg-gray-50"
                                                    >
                                                        {s.status === "En proceso" ? "Continuar" : "Iniciar"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/*Historial de inspecciones (en page === "inspections")*/}
                        <div className="bg-white p-4 rounded shadow">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">Historial de inspecciones</h3>
                                <div className="text-sm text-gray-500">{inspections.length} completadas</div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#FFF4E5]">
                                    <tr>
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Vehículo</th>
                                        <th className="p-2">Fecha</th>
                                        <th className="p-2">Inspector</th>
                                        <th className="p-2">Taller</th>
                                        <th className="p-2">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections
                                        .slice(0, 8)
                                        .map(it => (
                                            <tr key={it.id} className="border-t">
                                                <td className="p-2 text-sm text-gray-600">{it.id}</td>
                                                <td className="p-2 font-medium">{it.vehicle}</td>
                                                <td className="p-2">{new Date(it.date).toLocaleDateString('es-DO')}</td>
                                                <td className="p-2">
                                                    {inspectors.find(i => String(i.inspectorUserId) === String(it.userId))?.username || 'Desconocido'}
                                                </td>
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
                                onSaveProgress={(data) => saveInspectionProgress(data)}
                                onFinish={(data) => finishInspectionFlow(data)}
                                onCancel={(id) => { setExecInspection(null); }}
                            />
                        </div>
                    )}
                </div>
          )}

        {/* Inspectors list */ }
        {page === "inspectors" && (
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Inspectores Certificados</h1>
                    <div className="bg-white p-4 rounded shadow">
                        <div className="grid gap-4">
                            {inspectors.map(ins => (
                                <div key={ins.id} className="p-4 border rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-lg">{ins.inspectorId}</div>
                                            <div className="text-sm text-gray-600">{ins.role}</div>
                                            <div className="text-sm text-blue-600">{ins.username}</div>
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
                    <CertificatesView certificates={certificates} onSelect={(c) => { selectCertificate(c); openCertDetail(); }} selected={selectedCert} viewDetail={viewCertDetail} onCloseDetail={() => setViewCertDetail(false)} />
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
        {page === "history" && (
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: COLORS.intrantBlue }}>Historial completo de inspecciones</h2>
                    <div className="bg-white p-4 rounded shadow mt-3">
                        <div className="flex gap-2 mb-3">
                            <input placeholder="Buscar por placa o ID" value={historyFilter.q} onChange={(e) => setHistoryFilter({ ...historyFilter, q: e.target.value })} className="border p-2 rounded flex-1" />
                            <input type="date" value={historyFilter.from} onChange={(e) => setHistoryFilter({ ...historyFilter, from: e.target.value })} className="border p-2 rounded" />
                            <input type="date" value={historyFilter.to} onChange={(e) => setHistoryFilter({ ...historyFilter, to: e.target.value })} className="border p-2 rounded" />
                            <button onClick={() => exportInspectionsCSV()} className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.intrantOrange, color: "#fff" }}>
                                <Download className="w-4 h-4 inline mr-2" />
                                Exportar
                            </button>
                        </div>

                        <table className="w-full text-left">
                            <thead className="bg-[#FFF4E5]">
                                <tr>
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Vehículo</th>
                                    <th className="p-2">Fecha</th>
                                    <th className="p-2">Inspector</th>
                                    <th className="p-2">Taller</th>
                                    <th className="p-2">Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInspections.map(it => (
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