declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;

        NEXTAUTH_URL: string;
        NEXTAUTH_SECRET: string;
        NEXTAUTH_APPLE_ID: string;
        NEXTAUTH_APPLE_TEAM_ID: string;
        NEXTAUTH_APPLE_SECRET: string;

        NEXTAUTH_KAKAO_ID: string;
        NEXTAUTH_KAKAO_SECRET: string;

        NEXTAUTH_NAVER_ID: string;
        NEXTAUTH_NAVER_SECRET: string;

        NEXTAUTH_FACEBOOK_ID: string;
        NEXTAUTH_FACEBOOK_SECRET: string;

        NEXTAUTH_INSTAGRAM_ID: string;
        NEXTAUTH_INSTAGRAM_SECRET: string;

        NCP_SERVICE_ID: string;
        NCP_ACCESS_KEY: string;
        NCP_SECRET_KEY: string;
        NCP_SENDER_NUMBER: string;
        NCP_DEBUG_MODE: number;

        TOSS_CLIENT_KEY: string;
        TOSS_SECRET_KEY: string;
	}
}
