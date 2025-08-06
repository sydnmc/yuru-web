declare global {
	interface sysmember {
		name: string;
        type: string;
        img: string;
        main: boolean;
        link: string;
        fronting?: boolean;
        percent?: number;
        text?: string,
        tooltip?: string
    }

    interface description {
        type: string;
        content: any;
    }

    interface hover {
        username: string;
        userID: number;
        flag: string;
        flagCode: string;
        bannerUrl: string;
    }
}

export { sysmember, description, hover }
