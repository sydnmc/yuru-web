declare global {
	interface sysmember {
		name: string;
        type: string;
        img: string;
        main: boolean;
        fronting?: boolean;
        percent?: number;
        text?: string,
        tooltip?: string
    }

	interface beatmapset {
        incomplete: boolean;
        setBackgroundLink: string;
        setStatus: string;
        setTitle: string;
    	setUrl: string;
        setYapping: string;
    }

    interface gd {
        bgLink: string;
        songName: string;
        songURLs: string[];
        mapper: string;
        difficulties: string[];
        amountsMapped: string[];
        starRatings: number[];
        datesFinished: string[];
        bns: string[];
        isUnserious?: boolean;
        mapStatus: string
    }

    interface set {
        incomplete: boolean;
        setBackgroundLink: string;
        setStatus: string;
        setTitle: string;
        setUrl: string;
        setYapping?: string;
    }
}

export {}