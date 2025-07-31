declare global {
    interface alter {
        name: string;
        id: string;
        fronting: boolean;
        totalFrontTime: number;
        lastFrontTime?: number;
        lastFrontTimestamp?: Date;
        percent: number;

        lastFrontTimes?: alterTimes;
        totalFrontTimes?: alterTimes;

        frontHistory?: frontHistory[];
    }

    interface alterTimes {
        days: number;
        hours: number;
        minutes: number;
    }

    interface frontHistory {
        timestamp: Date;
        length: number;
    }
}

export { alter, alterTimes, frontHistory }
