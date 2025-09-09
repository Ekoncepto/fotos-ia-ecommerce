declare namespace React {
    type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
}