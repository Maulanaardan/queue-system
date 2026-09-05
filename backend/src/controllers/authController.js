import { login } from "../services/authService";
export async function authLogin(req, res) {
    try {
        // 1. ambil username dan password dari req.body
        const { username, password } = req.body;
        // 2. panggil login dari service
        const result = await login(username, password);
        // 3. return response sukses
        return res.status(200).json({ message: "Login berhasil", token: result.token });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Server error";
        return res.status(400).json({ message });
    }
}
