export default function handler(req, res) {
  fetch(
    "https://raw.githubusercontent.com/dixitsoham7/dixitsoham7.github.io/main/index.json"
  )
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}
