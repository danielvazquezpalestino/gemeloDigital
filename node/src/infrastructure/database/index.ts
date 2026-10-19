import pool = require('../../config/database');

class Database {
    static async connect(): Promise<void> {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Conexión a MySQL exitosa');
            connection.release();
        } catch (error) {
            console.error('❌ Error conectando a MySQL:', error);
            throw error;
        }
    }
}

export = Database;
