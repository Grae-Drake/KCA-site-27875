import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import Header from '../../sections/Header';
import Footer from '../../sections/Footer';

export default function DefaultBaseLayout(props) {
    const { page, site } = props;
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};

    return (
        <>
            <Head>
                <link rel="icon" href="/images/favicon/favicon.ico" sizes="any" />
                <link rel="icon" href="/images/favicon/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="theme-color" content="#f27c21" />
            </Head>
            <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
                <div className="sb-base sb-default-base-layout">
                    {site.header && <Header {...site.header} enableAnnotations={enableAnnotations} />}
                    {props.children}
                    {site.footer && <Footer {...site.footer} enableAnnotations={enableAnnotations} />}
                </div>
            </div>
        </>
    );
}
