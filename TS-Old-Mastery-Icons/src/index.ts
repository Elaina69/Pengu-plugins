function addStyleWithID(Id: string, style: string) {
    const styleElement = document.createElement('style');
    styleElement.id = Id;
    styleElement.appendChild(document.createTextNode(style));
    document.body.appendChild(styleElement);
}

function updateImageSrc(oldSrc: string, newSrc: string) {
    const originalSrc: any = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");

    Object.defineProperty(HTMLImageElement.prototype, "src", {
        get: originalSrc.get,
        set: function(value) {
            if (typeof value === "string" && value.includes(oldSrc)) {
                const newLink = newSrc;
                return originalSrc.set.call(this, newLink);
            }

            return originalSrc.set.call(this, value);
        }
    });
}

window.addEventListener("load", () => {
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-1.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-1.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-2.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-2.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-3.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-3.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-4.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-4.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-5.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-5.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-6.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-6.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-7.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-7.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-8.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-7.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-9.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-7.png"
    )
    updateImageSrc(
        "/fe/lol-collections/images/item-element/crest-and-banner-mastery-10.png", 
        "https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-collections/global/default/images/item-element/mastery-7.png"
    )

    addStyleWithID("old-mastery-icons-style", `
        .style-profile-legendary-champion-mastery-icon-component .style-profile-champion-icon .style-profile-champion-icon-banner-layer {
            height: unset !important;
            width: 84% !important;
            top: 0% !important;
        }
            
        /* Champions list */
        .rcp-fe-lol-champion-mastery-champion-item-lcm .mastery-crest-banner-display {
            height: 50px !important;
            width: 50px !important;
            left: -2px !important;
            top: -1px !important;
        }

        /* Profile */
        .style-profile-champion-icon-accent-layer {
            display: none !important;
        }

        .mastery-crest-component .mastery-crest-image[data-mastery-level="1"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="2"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="3"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="4"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="5"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="6"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="7"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="8"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="9"],
        .mastery-crest-component .mastery-crest-image[data-mastery-level="10"] {
            width: 75% !important;
            margin-top: 22px !important;
        }

        .mastery-crest-component .mastery-crest-image[data-mastery-level="1"] {
            content: url(/fe/lol-postgame/mastery-1.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="2"] {
            content: url(/fe/lol-postgame/mastery-2.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="3"] {
            content: url(/fe/lol-postgame/mastery-3.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="4"] {
            content: url(/fe/lol-postgame/mastery-4.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="5"] {
            content: url(/fe/lol-postgame/mastery-5.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="6"] {
            content: url(/fe/lol-postgame/mastery-6.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="7"] {
            content: url(/fe/lol-postgame/mastery-7.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="8"] {
            content: url(/fe/lol-postgame/mastery-7.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="9"] {
            content: url(/fe/lol-postgame/mastery-7.png) !important;
        }
        .mastery-crest-component .mastery-crest-image[data-mastery-level="10"] {
            content: url(/fe/lol-postgame/mastery-7.png) !important;
        }

        .style-profile-champion-icon:has(.style-profile-accent-image.level-0)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-0.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-1)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-1.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-2)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-2.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-3)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-3.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-4)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-4.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-5)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-5.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-6)
        .style-profile-banner-image {    
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-6.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-7)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-7.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-8)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-7.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-9)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-7.png) !important;
        }
        .style-profile-champion-icon:has(.style-profile-accent-image.level-10)
        .style-profile-banner-image {
            content: url(https://raw.communitydragon.org/13.1/plugins/rcp-fe-lol-champion-details/global/default/cdp-prog-mastery-7.png) !important;
        }

        /* Champion details */
        .crest-image > .mastery-crest-component {
            margin-top: 120px !important;
        }
        .crest-image > .mastery-crest-component .mastery-crest-image {
            width: 40% !important;
        }
    `);
});