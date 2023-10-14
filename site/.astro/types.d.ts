declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		
	};

	type DataEntryMap = {
		"categories": {
"auditory": {
	id: "auditory";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"cognitive": {
	id: "cognitive";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"dietary": {
	id: "dietary";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"learning": {
	id: "learning";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"mobility": {
	id: "mobility";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"motor": {
	id: "motor";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"safety": {
	id: "safety";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"sensory": {
	id: "sensory";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"visual": {
	id: "visual";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"vocal": {
	id: "vocal";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
};
"conditions": {
"acid-reflux": {
	id: "acid-reflux";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"acoustic-neuroma": {
	id: "acoustic-neuroma";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"addisons-disease": {
	id: "addisons-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"aging": {
	id: "aging";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"albinism": {
	id: "albinism";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"alcoholism": {
	id: "alcoholism";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"alzheimers-disease": {
	id: "alzheimers-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"amputation": {
	id: "amputation";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"amyotrophic-lateral-sclerosis-als": {
	id: "amyotrophic-lateral-sclerosis-als";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"anxiety-disorder": {
	id: "anxiety-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"aphasia": {
	id: "aphasia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"arthritis": {
	id: "arthritis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"asthma": {
	id: "asthma";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"ataxia": {
	id: "ataxia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"attention-deficit-hyperactivity-disorder-ad-hd": {
	id: "attention-deficit-hyperactivity-disorder-ad-hd";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"auditory-processing-disorder": {
	id: "auditory-processing-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"autism-spectrum": {
	id: "autism-spectrum";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"back-impairment": {
	id: "back-impairment";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"benign-paroxysmal-positional-vertigo-bppv": {
	id: "benign-paroxysmal-positional-vertigo-bppv";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"bipolar-disorder": {
	id: "bipolar-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"bladder-impairment": {
	id: "bladder-impairment";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"bleeding-disorder": {
	id: "bleeding-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"blind": {
	id: "blind";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"brain-injury": {
	id: "brain-injury";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"burn-injury": {
	id: "burn-injury";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"cancer": {
	id: "cancer";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"cardiovascular-disease": {
	id: "cardiovascular-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"cataplexy": {
	id: "cataplexy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"cerebral-palsy": {
	id: "cerebral-palsy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"charcot-marie-tooth-disease": {
	id: "charcot-marie-tooth-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"chronic-fatigue-syndrome": {
	id: "chronic-fatigue-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"chronic-pain": {
	id: "chronic-pain";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"color-vision-deficiency": {
	id: "color-vision-deficiency";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"colorblind": {
	id: "colorblind";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"concussion": {
	id: "concussion";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"covid-19": {
	id: "covid-19";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"cumulative-trauma-conditions": {
	id: "cumulative-trauma-conditions";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"deaf": {
	id: "deaf";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"deaf-blind": {
	id: "deaf-blind";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"depression": {
	id: "depression";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"diabetes": {
	id: "diabetes";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"drug-addiction": {
	id: "drug-addiction";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"dyscalculia": {
	id: "dyscalculia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"dysgraphia": {
	id: "dysgraphia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"dyslexia": {
	id: "dyslexia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"dystonia": {
	id: "dystonia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"eating-disorders": {
	id: "eating-disorders";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"ehlers-danlos-syndrome": {
	id: "ehlers-danlos-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"electrical-sensitivity": {
	id: "electrical-sensitivity";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"epilepsy": {
	id: "epilepsy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"essential-tremors": {
	id: "essential-tremors";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"fetal-alcohol-syndrome": {
	id: "fetal-alcohol-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"fibromyalgia": {
	id: "fibromyalgia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"food-allergy": {
	id: "food-allergy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"fragrance-sensitivity": {
	id: "fragrance-sensitivity";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"gastro-esophageal-reflux-disease-gerd": {
	id: "gastro-esophageal-reflux-disease-gerd";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"gastrointestinal-disorders": {
	id: "gastrointestinal-disorders";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"graves-disease": {
	id: "graves-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"guillain-barre-syndrome": {
	id: "guillain-barre-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"hand-amputation": {
	id: "hand-amputation";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"hard-of-hearing": {
	id: "hard-of-hearing";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"head-injury": {
	id: "head-injury";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"hearing-impairment": {
	id: "hearing-impairment";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"heart-condition": {
	id: "heart-condition";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"heartburn": {
	id: "heartburn";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"hepatitis": {
	id: "hepatitis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"human-immunodeficiency-virus-hiv": {
	id: "human-immunodeficiency-virus-hiv";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"huntingtons-disease": {
	id: "huntingtons-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"intellectual-impairient": {
	id: "intellectual-impairient";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"latex-allergy": {
	id: "latex-allergy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"learning-disability": {
	id: "learning-disability";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"leg-impairment": {
	id: "leg-impairment";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"little-person": {
	id: "little-person";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"lou-gehrigs-disease": {
	id: "lou-gehrigs-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"low-vision": {
	id: "low-vision";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"lupus": {
	id: "lupus";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"lyme-disease": {
	id: "lyme-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"marfan-syndrome": {
	id: "marfan-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"meniere": {
	id: "meniere";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"mental-health-conditions": {
	id: "mental-health-conditions";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"migraines": {
	id: "migraines";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"multiple-chemical-sensitivity": {
	id: "multiple-chemical-sensitivity";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"multiple-sclerosis": {
	id: "multiple-sclerosis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"muscular-dystrophy": {
	id: "muscular-dystrophy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"mutism": {
	id: "mutism";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"myalgic-encephalomyelitis": {
	id: "myalgic-encephalomyelitis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"myasthenia-gravis": {
	id: "myasthenia-gravis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"obesity": {
	id: "obesity";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"obsessive-compulsive-disorder-ocd": {
	id: "obsessive-compulsive-disorder-ocd";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"paraplegia": {
	id: "paraplegia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"parkinsons-disease": {
	id: "parkinsons-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"persistent-postural-perceptual-dizziness": {
	id: "persistent-postural-perceptual-dizziness";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"personality-disorder": {
	id: "personality-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"phobias": {
	id: "phobias";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"polio": {
	id: "polio";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"poliomyelitis": {
	id: "poliomyelitis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"post-polio": {
	id: "post-polio";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"post-traumatic-stress-disorder-ptsd": {
	id: "post-traumatic-stress-disorder-ptsd";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"postural-oorthostatic-tachycardia-syndrome-pots": {
	id: "postural-oorthostatic-tachycardia-syndrome-pots";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"pregnancy": {
	id: "pregnancy";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"quadriplegia": {
	id: "quadriplegia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"ramsay-hunt-syndrome": {
	id: "ramsay-hunt-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"raynauds-disease": {
	id: "raynauds-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"reflex-sympathetic-dystrophy-rsd": {
	id: "reflex-sympathetic-dystrophy-rsd";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"renal-kidney-disease": {
	id: "renal-kidney-disease";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"respiratory-impairments": {
	id: "respiratory-impairments";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"sarcoidosis": {
	id: "sarcoidosis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"schizophrenia": {
	id: "schizophrenia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"seasonal-affective-disorder-sad": {
	id: "seasonal-affective-disorder-sad";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"seizure-disorder": {
	id: "seizure-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"shingles": {
	id: "shingles";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"sickle-cell-anemia": {
	id: "sickle-cell-anemia";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"skin-conditions": {
	id: "skin-conditions";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"sleep-disorder": {
	id: "sleep-disorder";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"speech-language-impairment": {
	id: "speech-language-impairment";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"spina-bifida": {
	id: "spina-bifida";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"stroke": {
	id: "stroke";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"stuttering": {
	id: "stuttering";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"thyroid-disorders": {
	id: "thyroid-disorders";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"tourette-syndrome": {
	id: "tourette-syndrome";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"vertigo": {
	id: "vertigo";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
"vestibular-neuritis": {
	id: "vestibular-neuritis";
  collection: "conditions";
  data: InferEntrySchema<"conditions">
};
};
"requirements": {
"chemical-sensitivity": {
	id: "chemical-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"dietary-needs": {
	id: "dietary-needs";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"dizziness": {
	id: "dizziness";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"flashing-sensitivity": {
	id: "flashing-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"latex-sensitivity": {
	id: "latex-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-ability-to-be-alone": {
	id: "limited-ability-to-be-alone";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-ability-to-understand-implied-content": {
	id: "limited-ability-to-understand-implied-content";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-ability-to-understand-number-based-concepts": {
	id: "limited-ability-to-understand-number-based-concepts";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-ability-to-understand-spoken-language": {
	id: "limited-ability-to-understand-spoken-language";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-ability-to-write-or-understand-written-language": {
	id: "limited-ability-to-write-or-understand-written-language";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-attention-concentration": {
	id: "limited-attention-concentration";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-balance": {
	id: "limited-balance";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-breathing": {
	id: "limited-breathing";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-color-perception": {
	id: "limited-color-perception";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-executive-functions": {
	id: "limited-executive-functions";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-fine-motor-control": {
	id: "limited-fine-motor-control";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-grasping-grip-strength": {
	id: "limited-grasping-grip-strength";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-hearing-auditory-processing": {
	id: "limited-hearing-auditory-processing";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-lifting": {
	id: "limited-lifting";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-memory-memory-loss": {
	id: "limited-memory-memory-loss";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-mobility": {
	id: "limited-mobility";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-range-of-motion": {
	id: "limited-range-of-motion";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-reach-or-range": {
	id: "limited-reach-or-range";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-social-skills": {
	id: "limited-social-skills";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-speech": {
	id: "limited-speech";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-stamina": {
	id: "limited-stamina";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-strength-overall-weakness": {
	id: "limited-strength-overall-weakness";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"limited-vision-visual-processing": {
	id: "limited-vision-visual-processing";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"motion-sensitivity": {
	id: "motion-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"noise-sensitivity": {
	id: "noise-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"photosensitivity": {
	id: "photosensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"risk-from-triggers": {
	id: "risk-from-triggers";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"seizures": {
	id: "seizures";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"sensitivity-to-alcohol": {
	id: "sensitivity-to-alcohol";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"stress-intolerance": {
	id: "stress-intolerance";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"temperature-sensitivity": {
	id: "temperature-sensitivity";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"tremors-spasms": {
	id: "tremors-spasms";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"without-hearing": {
	id: "without-hearing";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"without-speech": {
	id: "without-speech";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
"without-vision": {
	id: "without-vision";
  collection: "requirements";
  data: InferEntrySchema<"requirements">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
