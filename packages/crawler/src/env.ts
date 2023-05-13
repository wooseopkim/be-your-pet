import { CustomError } from './CustomError';

export const supabaseUrl = getEnvOrThrow('SUPABASE_URL');
export const supabaseKey = getEnvOrThrow('SUPABASE_SERVICE_ROLE_KEY');
export const publicApiKey = getEnvOrThrow('PUBLIC_API_KEY');

function getEnvOrThrow(key: string) {
	const value = process.env[key];
	if (value === undefined) {
		throw new CustomError(`Missing key parameter (${key})`);
	}
	return value;
}

export function getNumberEnv(key: string): number | undefined {
	const value = process.env[key];
	if (value === undefined || value === '') {
		return undefined;
	}
	return parseInt(value, 10);
}
