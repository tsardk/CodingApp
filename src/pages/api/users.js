import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const users = await query('SELECT * FROM users ORDER BY id DESC');
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required.' });
            }

            const result = await query(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email]
            );
            return res.status(201).json({ id: result.insertId, name, email });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}