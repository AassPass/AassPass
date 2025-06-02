import { Request, Response } from "express";

export async function getHome(req: Request, res: Response): Promise<any> {

    return res.status(200).send({message: "Online"});
}