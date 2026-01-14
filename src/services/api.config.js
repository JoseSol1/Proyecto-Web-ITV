// src/services/api.config.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7125';

export const API_ENDPOINTS = {
    // User Account endpoints
    REGISTER: '/api/UserAccount/register',
    REGISTER_HOLDER: '/api/UserAccount/register-holder',
    CREATE_WORKSHOP_USER: '/api/UserAccount/create-workshop-user',
    LOGIN: '/api/UserAccount/login',
    GET_USER: (id) => `/api/UserAccount/${id}`,
    GET_ALL_USERS: '/api/UserAccount',
    ASSIGN_ROLE: '/api/UserAccount/assign-role',
    GET_HOLDERS: '/api/UserAccount/holders',
    GET_WORKSHOP_USERS: '/api/UserAccount/workshop-users',
    GET_WORKSHOPS: '/api/UserAccount/workshops',


    // Vehicle endpoints
    VEHICLE_REGISTER: '/api/Vehicle/register',
    VEHICLE_ASSIGN_OWNERSHIP: '/api/Vehicle/assign-ownership',
    VEHICLE_GET_BY_PLATE: (plate) => `/api/Vehicle/${plate}`,
    VEHICLE_GET_ALL: '/api/Vehicle',
    VEHICLE_UPDATE: (vehicleId) => `/api/Vehicle/${vehicleId}`,

    // Vehicle Makes
    VEHICLE_MAKES_GET_ALL: '/api/VehicleMakes',
    VEHICLE_MAKES_GET_BY_ID: (id) => `/api/VehicleMakes/${id}`,

    // Vehicle Models
    VEHICLE_MODELS_GET_ALL: '/api/VehicleModels',
    VEHICLE_MODELS_GET_BY_ID: (id) => `/api/VehicleModels/${id}`,
    VEHICLE_MODELS_BY_MAKE: (makeId) => `/api/VehicleModels/by-make/${makeId}`,

    // Vehicle Types
    VEHICLE_TYPES_GET_ALL: '/api/VehicleTypes',
    VEHICLE_TYPES_GET_BY_ID: (id) => `/api/VehicleTypes/${id}`,

    // Fuel Types
    FUEL_TYPES_GET_ALL: '/api/FuelTypes',
    FUEL_TYPES_GET_BY_ID: (id) => `/api/FuelTypes/${id}`,

    // Inspection endpoints
    INSPECTION_CREATE: '/api/Inspection',
    INSPECTION_GET_ALL: '/api/Inspection',
    INSPECTION_GET_BY_ID: (id) => `/api/Inspection/${id}`,
    INSPECTION_GET_ITEMS: (id) => `/api/Inspection/${id}/items`,
    INSPECTION_GET_DEFECTS: (id) => `/api/Inspection/${id}/defects`,
    INSPECTION_GET_PROGRESS: (id) => `/api/Inspection/${id}/progress`,
    INSPECTION_UPDATE_ITEM: (inspectionId, itemId) => `/api/Inspection/${inspectionId}/items/${itemId}`,
    INSPECTION_BATCH_UPDATE_ITEMS: (inspectionId) =>
        `/api/inspections/${inspectionId}/items/batch`,
    INSPECTION_ADD_DEFECT: (inspectionId) =>
        `/api/inspections/${inspectionId}/defects`,
    INSPECTION_COMPLETE: (inspectionId) =>
        `/api/inspections/${inspectionId}/complete`,    INSPECTION_ADD_DEFECT: (inspectionId) => `/api/Inspection/${inspectionId}/defects`,
    INSPECTION_START: (id) => `/api/Inspection/${id}/start`,
    INSPECTION_COMPLETE: (id) => `/api/Inspection/${id}/complete`,
    INSPECTION_RESCHEDULE: (id) => `/api/Inspection/${id}/reschedule`,
    INSPECTION_CANCEL: (id) => `/api/Inspection/${id}/cancel`,
    INSPECTION_CREATE_REINSPECTION: '/api/Inspection/reinspections',
    INSPECTION_GET_REINSPECTIONS: (originalInspectionId) => `/api/Inspection/${originalInspectionId}/reinspections`,

    // Templates endpoints
    TEMPLATES_GET_ALL: '/api/Inspection/templates',
    TEMPLATES_BY_VEHICLE_TYPE: (vehicleTypeId) => `/api/Inspection/templates/vehicle-type/${vehicleTypeId}`,
    TEMPLATES_GET_BY_ID: (templateId) => `/api/Inspection/templates/${templateId}`,

    // Certificate endpoints
    CERTIFICATE_REQUEST: '/api/Certificate/request',
    CERTIFICATE_CALLBACK: '/api/Certificate/callback',
    CERTIFICATE_SIMULATE: '/api/Certificate/simulate-processing',
    CERTIFICATE_GET_BY_ID: (id) => `/api/Certificate/${id}`,
    CERTIFICATE_GET_BY_INSPECTION: (inspectionId) => `/api/Certificate/inspection/${inspectionId}`,
    CERTIFICATE_GET_ALL: '/api/Certificate',
    CERTIFICATE_VERIFY: '/api/Certificate/verify',
    CERTIFICATE_VERIFY_BY_HASH: (qrHash) => `/api/Certificate/verify/${qrHash}`,
    CERTIFICATE_REVOKE: (id) => `/api/Certificate/${id}/revoke`,
    CERTIFICATE_STATISTICS: '/api/Certificate/statistics',
};

class HttpService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getToken() {
        return this.token;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = { ...options, headers };

        try {
            const response = await fetch(url, config);

            if (response.status === 401) {
                this.setToken(null);
                throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            if (response.status === 204) return null;

            return await response.json();
        } catch (error) {
            console.error('HTTP Request Error:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v != null)
        ).toString();

        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const httpService = new HttpService();