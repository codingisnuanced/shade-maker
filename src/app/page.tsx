'use client'

import AuthHandler from "@/components/AuthHandler/AuthHandler";
import ErrorHandler from "@/components/ErrorHandler/ErrorHandler";
import ShadeList from "@/components/ShadeList";
import { enterMember } from "@/services/auth";
import { Constants, models as M } from 'cabal-includes';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const App: React.FC = () => {

  const [member, setMember] = useState(null);
  const [meData, setMeData] = useState(new M.MemberEnter({
    username: Constants.EMPTY,
    password: Constants.EMPTY
  }));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleEnter = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const mb = await enterMember(meData);
    setMember(mb)
    console.log('ENTERED', mb);
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;

    setMeData(meData => {
      return {
        ...meData,
        [name]: value
      }
    });
  }

  const onFoundUpdateMember = (mb: M.Member) => {
    console.log('MEMBER', mb);
    if (mb == null) {

    } else {
      setMember(mb);
    }

    setIsLoading(false);
  }

  return (
    <main className="p-10px main-container">
      <ErrorHandler
        member={member}
      />
      <AuthHandler
        updateMember={onFoundUpdateMember}
        member={member}
      />
      {isLoading
        ? <p>Loading...</p>
        : (member
          ? (<form onSubmit={handleEnter} className="d-flex flex-d-col">
            <div className="field">
              <p className="label">Username</p>
              <input className="border-1px-solid" type="text" name="username" onChange={handleChange} />
            </div>
            <div className="field">
              <p className="label">Password</p>
              <input className="border-1px-solid" type="password" name="password" onChange={handleChange} />
            </div>

            <button className="btn btn-link dotted-link d-inline-flex align-items-start" type="submit">Enter</button>
          </form>)
          : (<p>You're in there.</p>)
        )
      }
    </main>
  );
}

export default App;