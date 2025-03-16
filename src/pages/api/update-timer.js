import { updateGameTimer } from "../../controllers/TimerIdController";

export default async function handler(req, res) {
  try {
    await updateGameTimer();
    res.status(200).json({ message: "Game Timer Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating game timer", error });
  }
}
