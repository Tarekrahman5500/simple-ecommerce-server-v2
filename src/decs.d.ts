type UnhandledInfo = {
      status: number,
      message: string,
}

declare namespace Express {

    interface  Request {
        UnhandledInfo?: UnhandledInfo
    }
}