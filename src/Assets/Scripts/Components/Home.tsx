import axios, { AxiosRequestConfig } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Option } from "../Models/Options";
import { State } from "../Models/States";
import Select from "react-select";
import { District } from "../Models/District";
import DatePicker from 'react-date-picker';
import { Session } from "../Models/Session";
import { SessionCard } from "./SessionCard";
export const Home: React.FunctionComponent = (): JSX.Element => {
    const [stateOptions, setStateOptions] = useState<Option[]>([]);
    const [selectedState, setSelectedState] = useState<
        Option | null | undefined
    >();

    const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<
        Option | null | undefined
    >();

    const [selectedDate, setSelectedDate] = useState<Date | Date[]>(new Date());

    const [sessionArr,setSessionArr] = useState<Session[]>([]);
    useEffect(() => {
        async function getStates() {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + "/v2/admin/location/states"
                );
                let stateArr = response?.data?.states as State[];
                let stateOptionArr = stateArr?.map(
                    (state) =>
                        ({
                            label: state.state_name,
                            value: state.state_id,
                        } as Option)
                );
                setStateOptions(stateOptionArr);
            } catch (error) {
                console.log(error);
            }
        }
        getStates();
    }, [setStateOptions]);

    const onStateChange = useCallback(
        async (selectedState: Option | null) => {
            setSelectedState(selectedState);
            if (selectedState) {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL +
                        "/v2/admin/location/districts/" +
                        selectedState.value
                );

                let districtArr = response?.data?.districts as District[];
                let districtOptionArr = districtArr?.map(
                    (district) =>
                        ({
                            label: district.district_name,
                            value: district.district_id,
                        } as Option)
                );
                setDistrictOptions(districtOptionArr);
            }
        },
        [setSelectedState]
    );
    const onDisctrictChange = useCallback((selectedDistrict: Option | null) => {
        setSelectedDistrict(selectedDistrict);
    }, [setSelectedDistrict]);

    const onDateChange = useCallback((date: Date | Date[])=>{
        setSelectedDate(date);
    },[setSelectedDate]);

    const onApply = async ()=>{
        let modDate = selectedDate as Date;
        let modDateStr = modDate.getDate()+"-"+modDate.getMonth()+"-"+modDate.getFullYear();
        const queryString = "district_id="+selectedDistrict?.value+"&"+"date="+modDateStr;
        const response = await axios.get(
            process.env.REACT_APP_API_URL + "/v2/appointment/sessions/public/findByDistrict?"+ queryString
        );
        setSessionArr(response?.data?.sessions as Session[]);
        
    }

    return (
        <>
            <Select
                value={selectedState}
                onChange={onStateChange}
                options={stateOptions}
            />
            <Select
                value={selectedDistrict}
                onChange={onDisctrictChange}
                options={districtOptions}
            />

            <DatePicker value = {selectedDate} onChange={onDateChange}/>

            <button className="btn btn-primary" onClick={onApply}>Apply</button>
            {sessionArr.map(session=>(<SessionCard session={session} />))}
        </>
    );
};
