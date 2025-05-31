"use client";

import { useQuery, useSession, useMutation } from 'modelence/client';
import { useNavigate } from 'react-router-dom';

import * as React from 'react';

import { getTextLines } from '../text';

import { Page } from '../layout/Page';
import { Card } from '../ui/Card';

import { SpeedWidget } from '../stats';
import { Typewriter } from '../typewriter/Typewriter';

export default function HomePage() {
  const navigate = useNavigate();
  const { mutateAsync: createTypingSession, isFetching } = useMutation('typingSession.create');

  const handleEnter = async () => {
    const sessionId = await createTypingSession();
    navigate(`/session/${sessionId}`);
  };

  return <Intro handleEnter={handleEnter} isFetching={isFetching} />;

  // return <TypewriterArena />;
}

function Intro({ handleEnter, isFetching }: { handleEnter: () => void, isFetching: boolean }) {  
  return (
    <Page>
      <Card className="bg-gradient-to-br from-blue-50 to-orange-50 mt-12">
        <div className="max-w-md mx-auto py-12 px-4 space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to Typesonic
            </h1>
            <p className="text-lg text-gray-600">
              Improve your typing skills and track your progress
            </p>
          </div>
          
          <div className="space-y-6">
            {isFetching ? <div className="text-center">Loading...</div> : <UserActions handleEnter={handleEnter} />}
          </div>
        </div>
      </Card>
    </Page>
  );
}

function UserActions({ handleEnter }: { handleEnter: () => void }) {
  const { user } = useSession();

  if (user) {
    return <ContinueAsUserButton handleEnter={handleEnter} />;
  }

  return (
    <>
      <SigninButton />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500">or</span>
        </div>
      </div>
      <ContinueAsGuestButton handleEnter={handleEnter} />
    </>
  );
}

function SigninButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/login')}
      className="w-full px-4 py-3 text-white bg-orange-600 rounded-lg font-medium shadow-sm hover:bg-orange-700 transition-colors"
    >
      Sign in
    </button>
  );
}

function ContinueAsGuestButton({ handleEnter }: { handleEnter: () => void }) {
  return (
    <button
      onClick={handleEnter}
      className="w-full px-4 py-3 text-orange-600 border border-orange-600 rounded-lg font-medium bg-white hover:bg-orange-50 transition-colors"
    >
      Continue as guest
    </button>
  );
}

function ContinueAsUserButton({ handleEnter }: { handleEnter: () => void }) {
  return (
    <button
      onClick={handleEnter}
      className="w-full px-4 py-3 text-white bg-orange-600 rounded-lg font-medium shadow-smhover:bg-orange-700 transition-colors"
    >
      Start typing
    </button>
  );
}
