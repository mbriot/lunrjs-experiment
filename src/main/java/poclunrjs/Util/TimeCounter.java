package poclunrjs.Util;

import org.apache.commons.lang3.time.StopWatch;

public class TimeCounter {
    private enum State {
        UNSTARTED, RUNNING, STOPPED
    }

    private final StopWatch watch;
    private State state;

    public TimeCounter() {
        this.watch = new StopWatch();
        this.state = State.UNSTARTED;
    }

    public void start() {
        switch (state) {
            case UNSTARTED:
                watch.start();
                break;
            case RUNNING:
                throw new IllegalStateException("Already started. ");
            case STOPPED:
                watch.resume();
        }
        state = State.RUNNING;
    }

    public void stop() {
        switch (state) {
            case UNSTARTED:
                throw new IllegalStateException("Not started. ");
            case STOPPED:
                throw new IllegalStateException("Already stopped. ");
            case RUNNING:
                watch.suspend();
        }
        state = State.STOPPED;
    }

    public String toString() {
        return watch.toString();
    }

    public long getTime() {
        return watch.getTime();
    }

    public long getNanoTime() {
        return watch.getNanoTime();
    }
}
