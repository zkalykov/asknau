// src/Demo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Demo.css'; // Import the new CSS file

function Demo() {
  return (
    <div className="demo-page">
      <div className="demo-container">
        {/* Header */}
        <div className="demo-header">
          <div className="flex items-center">
            <span className="demo-title">Welcome to AskNAU</span>
          </div>
          
          <div className="demo-navigation">
            <Link to="/chat" className="try-button">
              Try Now
            </Link>
          </div>
        </div>
        {/* Video Section */}
        <div>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/ujw0dVzNE_w9V2FN"
              title="AskNAU Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        
        

        <div className="demo-description">
        <h2 className="section-title">ℹ️ About</h2>
          <p>
            <strong>AskNAU</strong> is your AI-powered assistant designed to help you navigate the North American University experience. Whether you have questions about admissions, courses, campus life, or need guidance on academic resources, AskNAU is here to provide accurate and timely information.
          </p>
        </div>
        
        <div className="demo-description">
        <h2 className="section-title">🧑‍💻️ How it works?</h2>
          <p>
          It is powered by the GPT latest model, a cutting-edge language processing AI developed by OpenAI and Machine Learning models according local databases. This model allows AskNAU to understand and respond to a wide range of queries with human-like accuracy.
          </p>
        </div>
        
        <div className="demo-section">
          <h2 className="section-title">🚀 Contributions</h2>
          <p>
            AskNAU was founded by Zhyrgalbek Kalykov and supervised by Professor Sabina Adhikari, Computer Science Department at North American University.
          </p>
          <p>
            If you would like to contribute to the AskNAU project, we are open to collaborations on GitHub. See our developers' section.
          </p>
        </div>

        <div className="demo-section">
          <h2 className="section-title">👮 Policies</h2>
          <p>
            AskNAU tracks IP addresses to monitor usage, allowing up to 10 daily messages per user. This ensures fair access and optimal performance for all.
          </p>
          <p>
            We store names, emails, hashed passwords, account creation dates, and the dates and times of logins and logouts, along with the IP addresses of the devices used. This helps keep your account secure. We do not share sensitive personal information externally. However, it's important for users to know that their prompts may be viewed by developers for troubleshooting and system improvement purposes. Therefore, users should also avoid sharing sensitive personal details through their prompts.
          </p>
        </div>
        <div className="demo-section">
          <h2 className="section-title">🧑‍⚖️ Legal</h2>
          <p>
            By accessing and using AskNAU, you agree to adhere to the terms of use outlined herein. While we strive to ensure the accuracy and reliability of the information provided by AskNAU, we do not guarantee the correctness or completeness of the content made available. AskNAU, including its developers and affiliates, disclaims all liability for inaccuracies, errors, or any misunderstandings that may arise from the information provided.
          </p>
          <p>
            Users are responsible for the authenticity of the information they submit and should refrain from sharing sensitive personal information. We take user privacy seriously and implement robust security measures to protect user data, but we cannot be held liable for breaches caused by unauthorized access beyond our control. All user data is stored securely on servers provided by Heroku and Vercel.
          </p>
          <p>
            By using AskNAU, you accept that your interactions with the system may be monitored and reviewed by the development team for quality assurance and improvement purposes. Your continued use of AskNAU signifies your acceptance of these terms and any modifications made to them in the future.
          </p>
        </div>

        <div className="demo-section">
          <h2 className="section-title">☎️ Contact</h2>
          <p>
            For any questions, feedback, or concerns, please contact us at <a href="mailto:zhyrgalbekkalykov@gmail.com">zhyrgalbekkalykov@gmail.com</a> Zhyrgalbek Kalykov or for Professor Sabina Adhikari at <a href="mailto:sadhikari@na.edu">sadhikari@na.edu</a>.
          </p>
        </div>

        <div className="demo-section">
          <h2 className="section-title text-white">⚒️ For developers</h2>
          <p className="text-gray-300">
            If you're interested in the technical details or want to contribute to the AskNAU project, you can access our source code and development documents on GitHub. Below are the steps to download and run the React application on your local machine:
          </p>
          <ol className="list-decimal ml-4 text-gray-300">
            <li>Clone the repository from GitHub by running <code className="underline">git clone https://github.com/zkalykov/asknau.git</code> in your terminal.</li>
            <li>Navigate into the project directory with <code className="underline">cd AskNAU</code>.</li>
            <li>Install the necessary dependencies by running <code className="underline">npm install</code>.</li>
            <li>Start the application locally with <code className="underline">npm start</code>. This will launch the app in your browser at <code className="underline">http://localhost:3000</code>.</li>
          </ol>
          <p className="text-gray-300">
            You can find further documentation and ways to get involved by visiting our <a href="https://github.com/zkalykov/asknau" className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">GitHub page</a>.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Demo;
