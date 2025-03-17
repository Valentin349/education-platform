type AuthButtonProps = {
    type: 'Login' | 'SignUp' | 'Reset Password' | 'Forgot Password';
    loading: boolean;
}

export default function AuthButton({ type, loading }: AuthButtonProps) {
    return (
        <button
            disabled={loading}
            type="submit"
            className={`${loading ? 'bg-gray-600' : 'bg-blue-600'} rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
        >
            {loading ? 'Loading...' : type}
        </button>
    );
}