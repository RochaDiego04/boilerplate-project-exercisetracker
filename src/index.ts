import dotenv from "dotenv";
import { AddressInfo } from "net";
import app from "./app";

dotenv.config();

const PORT: string | number = process.env.PORT || 3000;

const listener = app.listen(PORT, () => {
  const serverAddress = listener.address() as AddressInfo;
  console.log("Your app is listening on port " + serverAddress.port);
});
