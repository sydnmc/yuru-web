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
        isIncomplete: boolean;
        bgLink: string;
        title: string;
        artist: string;
        url: string;
        mapId: string;
        description: description;
        creator: string;
    	dateFinished: string;
        creatorPerson: string;
        status: string;
    }

    interface gd {
        bgLink: string;
        title: string;
        artist: string;
        creator: string;
        mapId: string;
        status: string;
        isForRank: boolean;
        bn1: string;
        bn2: string;
        maps: beatmap[];

        plural?: boolean;
        plurality?: number;
        pluralInfo?: pluralGd[];
        statusColour?: string;
        statusTextColour?: string;
        diffColour?: string;
    }

    interface beatmap {
        url: string;
        id: string;
        diffname: string;
        amountMapped: string;
        sr: number;
        dateFinished: string;

        diffColour?: string;
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

export { gd }