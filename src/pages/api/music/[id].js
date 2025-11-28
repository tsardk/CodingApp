import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required.' });
            }

            const result = await query(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({ id, name, email });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const result = await query('DELETE FROM users WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json({ message: 'User deleted successfully.' });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}