import { useEffect } from 'react';

export default function LandingPage() {
useEffect(() => {
  const j = document.getElementById('j');
  const i = document.getElementById('in');
  const e = document.getElementById('er');
var co_div = document.getElementById('co_div');
var co_in = document.getElementById('co_in');
var co = document.getElementById('co');
let cod = 60;

const handleClick = () => {
const em = i.value.trim();
const ep = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!ep.test(em)) {
 e.textContent = 'Please enter a valid Email Address!';
} else {
      e.textContent = '';
      console.log(em);
      fetch('http://localhost/solia-backend/waitlist_application/email_signup.php', {
        //changes needed here later for backend pointing
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(em)}`
      })
        .then(async res => {
      const data = await res.json(); 

      if (res.ok) {
    co_div.classList.remove('hidden');
    coda(em, co_in, co);
    e.textContent = ''; 
      i.disabled = true;
j.disabled=true;
  } else {
    console.error('Server error:', data?.error);
    e.textContent = data?.error || 'Server error. Please try again.';
    co_div.classList.add('hidden');
  }
})
.catch(err => {
  console.error('Fetch error:', err);
  e.textContent = 'Network error. Please try again.';
  co_div.classList.add('hidden');
});
    }
  };


const coda = (em, co_in, co) => {
  let timer;
  let cod = 60;

  const startCountdown = () => {
    clearInterval(timer);
    cod = 60;
    timer = setInterval(() => {
      cod--;
      if (cod > 0) {
        co.textContent = cod + 's';
      } else {
        clearInterval(timer);
        timer = null;
        co.textContent = co_in.value.trim() === '' ? 'Resend' : 'Submit';
      }
    }, 1000);
  };

  startCountdown();
  wvs(em, co_in, co);

  co_in.addEventListener('input', function () {
    const val = co_in.value.trim();
    if (val === '') {
      co.textContent = cod > 0 ? cod + 's' : 'Resend';
      co.disabled = true;
      if(co.textContent == 'Resend') {
        co.disabled = false;
      }
    } else {
      clearInterval(timer);
      timer = null;
      co.textContent = 'Submit';
      co.disabled = false;
    }
  });
};

const wvs = (em,co_in, co) => {
  
  fetch("http://localhost/solia-backend/waitlist_application/verification_sender.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${encodeURIComponent(em)}`
  })
  .then(res => res.json())
  .then(data => {
    console.log("Code sent:", data.message);
  })
  .catch(err => {
    console.error("Error sending verification code:", err);
  });
  wvv(co_in, co, handleClick);
}
const wvv = (co_in, co, handleClick) => {
  co.addEventListener('click', function (e) {
    if (co.textContent !== 'Submit' && co.textContent !== 'Resend') {
      e.preventDefault();
      return;
    }

    const val = co_in.value.trim();
    if (co.textContent === 'Resend') {
      handleClick(); 
      return;
    }

    if (
      val.length !== 6 ||
      isNaN(Number(val))
    ) {
      const e = document.getElementById('er');
      e.textContent = 'Invalid Input!';
      return;
    }



    const i = document.getElementById('in');
    const em = i.value.trim();
    const eElem = document.getElementById('er');

    fetch("http://localhost/solia-backend/waitlist_application/verify_code.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${encodeURIComponent(em)}&code=${encodeURIComponent(val)}`
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          eElem.textContent = 'Waitlist Signup Successful!';
          eElem.classList.remove('text-red-700');
        } else {
          eElem.textContent = data?.error || 'Invalid Verification Code!';
        }
      })
      .catch(() => {
        eElem.textContent = 'Network error. Please try again.';
      });
  });
};


  if (j) j.addEventListener('click', handleClick);

 
  return () => {
    if (j) j.removeEventListener('click', handleClick);
  };
}, []);


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{ backgroundImage: "url('/landing-background.svg')" }}
    >
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6">
        <img className="h-12 w-auto" src="/solialogo.svg" alt="logo" />
        <ul className="flex space-x-6 text-white font-medium">
          <li className="cursor-pointer hover:text-purple-400">HOW IT WORKS</li>
          <li className="cursor-pointer hover:text-purple-400">FEATURES</li>
          <li className="cursor-pointer hover:text-purple-400">FAQ</li>
        </ul>
      </nav>

      <div className="flex flex-col-reverse lg:flex-row gap-6 mt-10 px-4 items-center justify-center">
        {/* Text/Form Section */}
        <div className="w-full lg:w-1/2 text-white flex flex-col justify-center items-start p-4">
          <div className="p-6 border-2 border-[#5A218E] rounded-lg w-full">
            <h2 className="text-4xl">Join the Future of</h2>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#5A218E] to-[#17C5E7] bg-clip-text text-transparent">
              MINING.
            </h1>
            <h3 className="text-xl mt-4">Get Early Access to Solia.</h3>

            <form className="mt-6">
              <div className="flex flex-col sm:flex-row border border-[#5A218E] rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent text-white placeholder-white px-4 py-2 focus:outline-none w-full"
                  id="in"
                />
                <button
                  type="button"
                  id="j" 
                  className="px-6 py-2 text-white font-semibold bg-gradient-to-r from-[#5A218E] to-[#17C5E7] hover:opacity-90 transition-all"
                >
                  JOIN WAITLIST
                </button>

              </div>
              <div id="co_div" className="flex flex-row border border-[#5A218E] rounded-lg overflow-hidden my-2 hidden">
                <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Verification Code"
                className="bg-transparent text-white placeholder-white px-4 py-2 focus:outline-none w-full no-spinner"
                id="co_in"
                />
                <button
                  type="button"
                  id="co" 
                  className="px-6 py-2 text-white font-semibold bg-gradient-to-r from-[#5A218E] to-[#17C5E7] hover:opacity-90 transition-all"
                >
                 60s
                </button>
  </div>
                <span id='er' className='text-red-700 text-sm '></span>

            </form>

          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src="/solia-mining.svg"
            alt="mining"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
