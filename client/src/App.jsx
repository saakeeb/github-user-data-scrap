// client side
import { useState } from "react";
import axios from "axios";

function App() {
  const [githubName, setGithubName] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/github-data", {
        githubName,
      });
      console.log("response: ", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("data: ", data);

  return (
    <div>
      <input
        type="text"
        value={githubName}
        onChange={(e) => setGithubName(e.target.value)}
      />
      <button onClick={fetchData}>Fetch Data</button>
      {data && (
        <div>
          <h2>GitHub Data</h2>
          <h4>Name: {data.fName}</h4>
          <p>Total Follower: {data.followerText}</p>
          <p>Total Following: {data.followingText}</p>
          <p>Company Name: {data.companyName}</p>
          <p>Location: {data.locationName}</p>
          <p>
            Github URL: <a href={data.gitUrl}>{data.gitUrl}</a>
          </p>
          <p>
            Linkedin URL: <a href={data.userLinkedin}>{data.userLinkedin}</a>
          </p>
          <p>
            Twitter URL: <a href={data.userTwitter}>{data.userTwitter}</a>
          </p>
          <p>
            Link URL: <a href={data.userLink}>{data.userLink}</a>
          </p>
          <p>
            Link2 URL: <a href={data.userLink2}>{data.userLink2}</a>
          </p>
          <p>
            Link3 URL: <a href={data.userLink3}>{data.userLink3}</a>
          </p>
          <p>Screenshot: </p>
          <img src={data.screenshotPath} alt="GitHub Contribution" />
        </div>
      )}
    </div>
  );
}

export default App;
