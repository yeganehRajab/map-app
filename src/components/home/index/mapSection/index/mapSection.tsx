import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Stack } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { searchLocation } from '@/api/searchLocation/api';
import { convertMtoMS } from '@/utils/time/convertMtoMS';
import SearchLocationBottomSheet from '../bottomSheets/searchLocationBottomSheet';
import {
  searchLocationFormInitialValue,
  searchLocationFormValidationSchema,
} from '../bottomSheets/searchLocationBottomSheet.tools';
import MapMenu from '../mapMenue/mapMenu';
import ShowAllLocationsButton from '../showAllLocationsButton/showAllLocationsButton';
import { IPostSearchLocationResponse } from '@/api/searchLocation/api.types';

const MapPart = dynamic(() => import('../mapPart/mapPart'), {
  ssr: false,
});

const MapSection: FC = () => {
  // location bottom sheet handler state
  const [locationBottomSheetIsOpen, setLocationBottomSheetIsOpen] =
    useState<boolean>(false);
  // bounds fitter state
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState<boolean>(false);
  //handle tracking the locations
  const [isTrackingLocation, setIsTrackingLocations] = useState<boolean>(false);
  // Interval reference
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  //searched values
  const [locations, setLocations] = useState<IPostSearchLocationResponse[]>();

  // Function to toggle fit bounds trigger
  const showAllLocations = () => {
    setFitBoundsTrigger((prev) => !prev);
    setIsTrackingLocations((prev) => !prev);
  };

  //search field value
  const {
    mutate: searchLocationMutation,
    isLoading: searchLocationMutationIsLoading,
  } = useMutation({
    mutationKey: ['searchedLocation'],
    mutationFn: searchLocation,
    onError: () => {
      toast.error('error!!');
    },
    onSuccess: (response) => {
      toast.success('success!!');
      setLocationBottomSheetIsOpen(false);
      //put locations in state
      setLocations((prev) => {
        if (prev) {
          if (prev[+prev?.length - 1].name === response.name) return prev;
          else return [...prev, response];
        } else return [response];
      });
    },
  });

  //handle search formik
  const searchLocationFormik = useFormik({
    initialValues: searchLocationFormInitialValue,
    validationSchema: searchLocationFormValidationSchema,
    onSubmit: (values) => {
      searchLocationMutation({ search: values.search });
      //check if has tracking set is tracking true
      if (searchLocationFormik.values.period?.value !== 0)
        setIsTrackingLocations(true);
    },
  });

  //check has Tracking
  const hasTracking =
    !!searchLocationFormik.values.period?.value &&
    searchLocationFormik.values.period?.value !== 0;

  //handle refetch data in specific period
  useEffect(() => {
    if (hasTracking) {
      if (isTrackingLocation) {
        const intervalId = setInterval(
          () =>
            searchLocationMutation({
              search: searchLocationFormik.values.search ?? '',
            }),
          convertMtoMS(searchLocationFormik.values.period?.value as number)
        );
        setIntervalRef(intervalId);
      } else {
        // Clear interval if tracking is stopped
        if (intervalRef) {
          clearInterval(intervalRef);
          setIntervalRef(null);
        }
      }
    }
  }, [
    searchLocationFormik.values.period,
    searchLocationFormik.values.search,
    isTrackingLocation,
  ]);

  return (
    <Stack>
      {/* map */}
      <MapPart
        searchLocationData={locations}
        fitBoundsTrigger={fitBoundsTrigger}
      />

      {/* map menu */}
      <MapMenu setSearchLocationBottomSheet={setLocationBottomSheetIsOpen} />

      {/* search location bottomSheets */}
      <SearchLocationBottomSheet
        formik={searchLocationFormik}
        locationBottomSheet={locationBottomSheetIsOpen}
        setLocationBottomSheet={setLocationBottomSheetIsOpen}
        loading={searchLocationMutationIsLoading}
      />

      {/* show all locations buttons*/}
      {hasTracking && (
        <ShowAllLocationsButton
          onClick={showAllLocations}
          isTrackingLocation={isTrackingLocation}
        />
      )}
    </Stack>
  );
};

export default MapSection;
