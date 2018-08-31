export class logger {
public static error(text:string):any {
    console.log("===Error===")
    console.log(text)
    console.log("===========")
}

public static notice(text:string):any{
    console.log("NOTICE LOG")
    console.log(text)
    console.log("NOTICE LOG")
}

}