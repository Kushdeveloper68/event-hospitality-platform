import React, {useState, useEffect} from "react"

function UserSignup() {
  const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
   const [fullName, setFullName] = useState('')
   const [oragnizationName, setOragnizationName] = useState('')
   const [isTermConditions, setIsTermConditions] = useState(false)

   useEffect(() => {
     console.log(email)
     console.log(password )
     console.log(fullName )  
     console.log(oragnizationName)  
     console.log(isTermConditions)  
   }, [email, password, fullName, oragnizationName, isTermConditions])
   
   const submit = () =>  {
    // api login here.....
   }
  return (
    <>
     {/* <!-- Top Navigation Bar --> */}
  <header className="w-full bg-white dark:bg-background-dark border-b border-border-subtle dark:border-gray-800 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2 text-primary">
        <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">layers</span>
        </div>
        <h2 className="text-neutral-text dark:text-white text-lg font-bold tracking-tight">
          Hospitality Platform
        </h2>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">Already have an account?</span>
        <button className="text-primary text-sm font-semibold hover:underline">
          Log in
        </button>
      </div>
    </div>
  </header>
  {/* <!-- Main Content Area --> */}
  <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
    <div className="w-full max-w-[480px]">
      {/* <!-- Signup Card --> */}
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border-subtle dark:border-gray-800 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* <!-- Header --> */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-neutral-text dark:text-white text-3xl font-bold tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Join your operations team on the hospitality platform.
            </p>
          </div>
          {/* <!-- Form Section --> */}
          <form className="space-y-5" onsubmit="event.preventDefault();">
            {/* <!-- Full Name --> */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Full Name</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="John Doe" type="text" value={fullName} onChange={(e) => {setFullName(e.target.value)}} />
              </div>
            </div>
            {/* <!-- Business Email --> */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Business Email</label>
              <input
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="name@company.com" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            </div>
            {/* <!-- Organization Name --> */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Organization Name</label>
              <input
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Acme Events Corp" type="text" value={oragnizationName} onChange={(e) => {setOragnizationName(e.target.value)}} />
            </div>
            {/* <!-- Password --> */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Password</label>
              <div className="relative group">
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                  placeholder="••••••••" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters with a symbol.
              </p>
            </div>
            {/* <!-- Terms --> */}
            <div className="flex items-start gap-3 py-2">
              <input className="mt-1 size-4 rounded border-border-subtle text-primary focus:ring-primary" id="terms"
                type="checkbox" value={isTermConditions}  onChange={(e) => {setIsTermConditions(e.target.checked)}}/>
              <label className="text-sm text-gray-500 dark:text-gray-400 leading-tight" for="terms">
                I agree to the
                <a className="text-primary hover:underline" href="#">Terms of Service</a>
                and
                <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>
            {/* <!-- Primary Button --> */}
            <button
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>
        </div>
        {/* <!-- Card Footer (Mobile Visible) --> */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 text-center md:hidden">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
            <a className="text-primary font-semibold hover:underline" href="#">Log in</a>
          </p>
        </div>
      </div>
      {/* <!-- Global Footer --> */}
      <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
        Enterprise Reliability • ISO 27001 Certified
      </footer>
    </div>
  </main>
  {/* <!-- Visual Background Element (Subtle) --> */}
  {/* <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
  </div> */}
    </>
  )
}

export default UserSignup