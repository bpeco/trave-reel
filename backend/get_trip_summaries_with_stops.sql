
    with cte_stops_by_itinerary as (
        select
            t.trip_id,
            t.name,
            t.country,
            it.itinerary_id,
            count(distinct st.stop_id) as count_stops
        from trips t
        inner join itineraries_by_trip it on t.trip_id = it.trip_id
        inner join stops_by_itinerary st on it.itinerary_id = st.itinerary_id
        where t.created_by = created_by
        group by t.trip_id, t.name, t.country, it.itinerary_id
    )
    select
        trip_id,
        name,
        country,
        coalesce(sum(count_stops), 0) as stops_count
    from cte_stops_by_itinerary
    group by trip_id, name, country

    union

    -- viajes sin itinerarios ni stops
    select
        t.trip_id,
        t.name,
        t.country,
        0 as stops_count
    from trips t
    where t.created_by = created_by
      and not exists (
          select 1 from itineraries_by_trip it
          where it.trip_id = t.trip_id
      );
