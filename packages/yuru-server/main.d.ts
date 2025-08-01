declare global {
    interface alter {
        name: string;
        id: string;
        fronting: boolean;
        totalFrontTime: number;
        lastFrontTime?: number;
        lastFrontTimestamp?: Date;
        percent: number;
        firstAppearance?: number;

        lastFrontTimes?: alterTimes;
        totalFrontTimes?: alterTimes;

        frontHistory?: frontHistory[];
        pfpLink?: string;
    }

    interface alterTimes {
        days: number;
        hours: number;
        minutes: number;
    }

    interface frontHistory {
        timestamp: number;
        length: number;
    }

    interface gd {
        bgLink: string;
        title: string;
        titleUnicode?: string;
        artist: string;
        artistUnicode?: string;
        creator: string;
        mapId: string;
        status: string;
        isForRank: boolean;
        bns: string[];
        maps: beatmap[];
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
}

export { alter, alterTimes, frontHistory, gd, beatmap }
