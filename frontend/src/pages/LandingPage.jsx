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
let  invbtn = '';
const handleClick = () => {
const em = i.value.trim();
const ep = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!ep.test(em)) {
 e.textContent = 'Please enter a valid Email Address!';
} else {
    var inv = document.getElementById('inv');

      e.textContent = '';
      console.log(em);
      fetch('https://gestech.co.mz/api/waitlist_application/email_signup.php', {
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
      inv.classList.add('hidden');

j.disabled=true;
  } else {
    co_div.classList.add('hidden');
          invite();
      inv.classList.remove('hidden');
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
  
  fetch("https://gestech.co.mz/api/waitlist_application/verification_sender.php", {
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
var inv_link = document.getElementById('inv_link');
    const urlParams = new URLSearchParams(window.location.search);
    const refcode = urlParams.get('refcode') || '';
  var inv = document.getElementById('inv');
var co_div = document.getElementById('co_div');

    fetch("https://gestech.co.mz/api/waitlist_application/verify_code.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${encodeURIComponent(em)}&code=${encodeURIComponent(val)}&referral_code=${encodeURIComponent(refcode)}`
    })
      .then(res => res.json())
      .then(data => {
        if(data.success && data.referral_link) {
invite();
inv.classList.remove('hidden');
    co_div.classList.add('hidden');

        } else {
      eElem.textContent = data?.error || 'Invalid verification code.';
      eElem.classList.add('text-red-700');
      inv.classList.add('hidden');
    co_div.classList.remove('hidden');

    }
      })
      .catch(() => {
        eElem.textContent = 'Network error. Please try again.';
      });
  });
};

const invite = () => {
  var inv_link = document.getElementById('inv_link');
  var inv_btn = document.getElementById('inv_btn');
  var inv = document.getElementById('inv');
    var inv_count = document.getElementById('inv_count');
    var em = document.getElementById('in');

    fetch("https://gestech.co.mz/api/waitlist_application/invite_link_requester.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${encodeURIComponent(em.value)}&domain=${encodeURIComponent(window.location.origin)}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.referral_link) {
        if (inv_link) {
          inv_link.textContent = data.referral_link;
        }
      }
    })
    .catch(console.error);


    fetch("https://gestech.co.mz/api/waitlist_application/get_user_rank.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${encodeURIComponent(em.value)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.rank) {
      if (inv_count) {
        inv_count.textContent = `#${data.rank}`;
        console.log(data.rank)
        inv_bal.textContent = `${data.invite_count} Points`
      }
    }
  })
  .catch(err => {
    console.error(err);
  });
var towa = document.getElementById('towa');
      fetch("https://gestech.co.mz/api/waitlist_application/waitlist_count.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.total_waitlist) {
      if (towa) {
       
        towa.textContent  = `${data.total_waitlist} people have joined so far`;
      }
    }
  })
  .catch(err => {
    console.error(err);
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
<div className="w-full  rounded-xl border border-[#5A218E] p-4 shadow-md my-4 hidden" id='inv'>
  <div className="text-center text-sm font-medium text-white mb-2">
    You're in! You're <span className="font-bold text-gray-500" id='inv_count'></span> in line. <br />
    <a href="#" className="text-gradient-to-r from-[#5A218E] to-[#17C5E7] hover:opacity-90 underline">Invite friends to skip ahead!</a>
  </div>
<div className='bg-gray-100'>
  <div className="flex items-center justify-between  rounded-lg px-4 py-2">
    <span className="text-sm font-medium text-gray-700">Your Invite Link:</span>
    <button
      onClick={() => {
      const linkText = document.getElementById('inv_link')?.textContent || '';
      navigator.clipboard.writeText(linkText);
      }}

      className="text-[#5A218E] text-sm font-semibold hover:underline bg-gray-300 px-2"
      id='inv_btn'
      type='button'
    >
      Copy Link
    </button>
  </div>
  <div className='flex items-center justify-between'>
 <span className="text-sm font-medium text-gray-700 px-4" id="inv_link"></span>
 <span className="text-sm font-medium text-gray-700 px-4" id="inv_bal"></span>

  </div>
 </div>

  <div className="text-center text-sm font-semibold text-white mt-3" id='towa'>
  </div>

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