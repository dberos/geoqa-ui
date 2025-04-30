"use client"
 
import { ColumnDef } from "@tanstack/react-table"

type Results = {
    id: number,
    c_image_10: string,
    cWKT10: string,
    thumb: string
}

export const columns: ColumnDef<Results>[] = [
    {
      accessorKey: "c_image_10",
      header: "c_image_10",
    },
    {
      accessorKey: "cWKT10",
      header: "cWKT10",
    },
    {
      accessorKey: "thumb",
      header: "thumb",
    },
];

export const results: Results[] = [
    {
        id: 1,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 2,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 3,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 4,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 5,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 6,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 7,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 8,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 9,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    },
    {
        id: 10,
        c_image_10: "http://ai.di.uoa.gr/da4dte/resource/S2A_31UER_20210211_0_L2A",
        cWKT10: "<http://www.opengis.net/def/crs/EPSG/0/4326> POLYGON ((4.09306997334752 50.547153095014025, 4.549313744586826 50.54197601541307, 4.517849584951996 49.55480922971432, 3.7061366458497687 49.5626097183454, 4.09306997334752 50.547153095014025))",
        thumb: "https://earth-search.aws.element84.com/v1/collections/sentinel-2-l2a/items/S2A_31UER_20210211_0_L2A/thumbnail"
    }
];